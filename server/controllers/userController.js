// to user data
import User from "../models/User.js";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import CourseProgress from "../models/CourseProgress.js";
import Stripe from "stripe";

export const createUser = async (req, res) => {
  try {
    console.log("CREATE USER ROUTE HIT");

    // 🔥 CORRECT WAY (NO brackets)
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No userId found",
      });
    }

    const { name, email, image } = req.body;

    // Check if user already exists
    const existingUser = await User.findById(userId);

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        user: existingUser,
      });
    }

    // Create new user
    const newUser = await User.create({
      _id: userId,  // 🔥 VERY IMPORTANT
      name,
      email,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET USER DATA =================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    res.json({ success: true, user });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= USER ENROLLED COURSES =================
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const userData = await User.findById(userId).populate("enrolledCourses");

    if (!userData) {
      return res.json({ success: false, message: "user not found" });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= PURCHASE COURSE =================
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth;

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "data not found" });
    }

    const amount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId: userData._id,
      amount: amount.toFixed(2),
    });

    // ⭐⭐⭐ IMPORTANT FIX (ENROLLMENT SAVE)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: courseData.courseTitle,
            },
            unit_amount: Math.floor(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= UPDATE COURSE PROGRESS =================
export const updateUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "lecture already completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();

    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "progress updated" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET COURSE PROGRESS =================
export const getUserCourseProgress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    res.json({ success: true, progressData });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= ADD USER RATING =================
export const addUserRating = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: "invalid details" });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.json({ success: false, message: "course not found" });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "user has not purchased the course",
      });
    }

    const existingRatingIndex =
      courseDetails.courseRating.findIndex(
        (r) => r.userId === userId
      );

    if (existingRatingIndex > -1) {
      courseDetails.courseRating[existingRatingIndex].rating = rating;
    } else {
      courseDetails.courseRating.push({ userId, rating });
    }

    await courseDetails.save();

    res.json({ success: true, message: "rating added" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
