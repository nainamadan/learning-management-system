// ==============================
// EDUCATOR CONTROLLER (FINAL FIX)
// ==============================

import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import { v2 as cloudinary } from "cloudinary";


// ==============================
// UPDATE ROLE
// ==============================
export const updateRoleToEducator = async (req, resp) => {
  try {
   const { userId } = req.auth;

    if (!userId) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    resp.json({
      success: true,
      message: "Role updated to educator",
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// ADD COURSE
// ==============================
export const addCourse = async (req, resp) => {
  try {
   const { userId } = req.auth;  // IMPORTANT
    const { courseData } = req.body;
    const imageFile = req.file;

    if (!courseData || !imageFile) {
      return resp.status(400).json({
        success: false,
        message: "Missing course data or image",
      });
    }

    const parsed = JSON.parse(courseData);

    const imageUpload = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "thumbnails" },
    (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }
  );
  stream.end(imageFile.buffer);
});
    const newCourse = await Course.create({
      courseTitle: parsed.courseTitle,
      courseDescription: parsed.courseDescription,
      coursePrice: Number(parsed.coursePrice),
      discount: Number(parsed.courseDiscount),
      courseContent: parsed.courseChapters,
      educator: userId,
      courseThumbnail: imageUpload.secure_url,
    });

    return resp.status(201).json({
      success: true,
      course: newCourse,
    });

  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// GET EDUCATOR COURSES
// ==============================
export const getEducatorCourses = async (req, resp) => {
  try {
    const { userId } = req.auth;

    const courses = await Course.find({ educator: userId });

    resp.json({
      success: true,
      courses,
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// DASHBOARD DATA (FINAL FIX)
// ==============================
export const educatorDashboardData = async (req, resp) => {
  try {
    const { userId } = req.auth;

    // 1. Get educator courses
    const courses = await Course.find({ educator: userId });

    const totalCourses = courses.length;

    const courseIds = courses.map((c) => c._id);

    // 2. Get purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarning = purchases.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // 3. Get enrolled students
    const enrolledStudentsData = await Promise.all(
      courses.map(async (course) => {
        const students = await User.find(
          { _id: { $in: course.enrolledStudents } },
          "name image"   // ✅ FIXED (image not imageUrl)
        );

        return students.map((student) => ({
          courseTitle: course.courseTitle,
          student,
        }));
      })
    );

    // 4. Response (FINAL CLEAN FORMAT)
    return resp.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings: totalEarning,
        enrolledStudentsData: enrolledStudentsData.flat(), // ✅ FIXED NAME
      },
    });

  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==============================
// ENROLLED STUDENTS
// ==============================
export const getEnrolledStudentData = async (req, resp) => {
  try {
   const { userId } = req.auth;

    const courses = await Course.find({ educator: userId });

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name image")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((p) => ({
      student: p.userId,
      courseTitle: p.courseId.courseTitle,
      purchaseDate: p.createdAt,
    }));

    resp.json({
      success: true,
      enrolledStudents,
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message,
    });
  }
};