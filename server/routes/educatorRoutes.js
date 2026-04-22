// // route for changeing role to eductor
// import express from 'express'


// import {addCourse, updateRoleToEducator,getEducatorCourses} from "../controllers/educatorController.js"
// import upload from '../configs/multer.js';
// import protectEducator from "../middlewares/authMiddleware.js"
// // use express router
// const educatorRouter=express.Router();
// educatorRouter.get('/update-role',updateRoleToEducator)
// // whenever img is passed in form data then form data will be parsed using multer
// educatorRouter.post(
//   "/add-course",

//   upload.single("image"),
//   protectEducator,        // only educator can add course
//   addCourse
// );
// educatorRouter.get('/courses',protectEducator,getEducatorCourses)
// // export this router

// export default educatorRouter








// route for changing role to educator

import express from "express";
import {
  addCourse,
  updateRoleToEducator,
  getEducatorCourses, 
  getEnrolledStudentData,educatorDashboardData
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";
import protectEducator from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// change role to educator
educatorRouter.get(
  "/update-role",
  updateRoleToEducator
);

// add new course (only educator)
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

// get educator courses
educatorRouter.get(
  "/courses",
  protectEducator,
  getEducatorCourses
);

educatorRouter.get(
  "/dashboard",
  protectEducator,
  educatorDashboardData
);


educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentData
);
export default educatorRouter;
