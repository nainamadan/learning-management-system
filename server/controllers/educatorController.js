// make fn that update role of educator .regular user can becoome educator

import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";


// ==============================
// Update Role to Educator
// ==============================
// clerk me jaakr check rkna whether role educator h ya nhi
export const updateRoleToEducator = async (req, resp) => {
  try {
    // getuser id
    // getting id from auth so hence add this in request and added using clerk middleware

    const { userId } = req.auth();  
    if (!userId) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
// jis user id ka meta data change krna h 
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",  
      }
    });

    resp.json({
      success: true,
      message: "you can publish a course now"
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// ==============================
// add new course on db
// ==============================

export const addCourse = async (req, resp) => {
  try {

    // getcourse data
    const { courseData } = req.body;

    // we have to parse the image as we are getting it as a form data using multer
    const imageFile = req.file;

    // educator id (Clerk userId)
    const { userId } = req.auth();

    if (!imageFile) {
      return resp.status(400).json({
        success: false,
        message: "thumbnail not attached"
      });
    }

    if (!courseData) {
      return resp.status(400).json({
        success: false,
        message: "course data missing"
      });
    }

    // parse the data as received as a string
    const parsedCourseData =await JSON.parse(courseData);

    // upload imagefile on cloudinary
    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path
    );

    // store in db with educator id + thumbnail
    const newCourse = await Course.create({
      ...parsedCourseData,
      educator: userId,   // ✅ educatorId = Clerk userId
      courseThumbnail: imageUpload.secure_url
    });

    // create response
    resp.status(201).json({
      success: true,
      message: "course added",
      course: newCourse
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// get all courses of educator
export const getEducatorCourses = async (req, resp) => {
  try {

    const { userId } = req.auth();   // ✅ get Clerk userId

    if (!userId) {
      return resp.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const courses = await Course.find({ educator: userId });

    resp.status(200).json({
      success: true,
      courses
    });

  } catch (error) {
    resp.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// get eductor dashboard data
// ernng,enrolledstudents,no of courses
export const educatorDashboardData=async(req,resp)=>{
  try {
    // get eductor
    const { userId } = req.auth(); 
    // find courses of this d
    
    const courses = await Course.find({ educator: userId });
    // need total courses
    const totalCourses=courses.length;
    // calculate earnong total
    //get id of each Course
   const courseIds=courses.map(course=>course._id);
  //  calculate from purcheses
  const purchases=await Purchase.find({
// where status is completed
courseId:{$in:courseIds},
status:'completed'
  })
  const totalEarning=purchases.reduce((sum,purchase)=>sum+purchase.amount,0);

  // get student data who is enrolled in course
  const enrolledstudentsData=[];
  for(const course of courses){
    const students=await User.find({
      _id:{$in:course.enrolledStudents}
    },'name imageUrl');
students.forEach(student => {
  enrolledstudentsData.push({
    courseTitle:course.courseTitle,
    student
  })
});
resp.json({success:true,dashboardData:{
  totalEarning,enrolledstudentsData,totalCourses
}})
  }
  } catch (error) {
    resp.json({success:false,message:error.message})
  }
}


// get enrolled dta awith purchase data
export const getEnrolledStudentData=async(req,resp)=>{
  try {
     // get eductor
    const { userId } = req.auth(); 
    // find courses of this d
    
    const courses = await Course.find({ educator: userId });

      const courseIds=courses.map(course=>course._id);
      const purchases=await Purchase.find({
// where status is completed
courseId:{$in:courseIds},
status:'completed'
  }).populate('userId','name  imageUrl').populate('courseId','courseTitle')

  // find student data
  const enrolledStudents=purchases.map(purchase=>({
    student:purchase.userId,
    courseTitle:purchase.courseId.courseTitle,
    purchaseDate:purchase.createdAt
  }))
  resp.json({success:true,enrolledStudents})
  } catch (error) {
      resp.json({success:false,message:error.message})
  }
}