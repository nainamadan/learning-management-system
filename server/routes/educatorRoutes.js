import express from "express";
import {
  addCourse,
  updateRoleToEducator,
  getEducatorCourses,
  getEnrolledStudentData,
  educatorDashboardData,
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";
import protectEducator from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// ==========================
// UPDATE ROLE (FIXED → POST)
// ==========================
educatorRouter.post("/update-role", updateRoleToEducator);

// ==========================
// ADD COURSE (FIXED ORDER)
// ==========================
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

// ==========================
// GET COURSES
// ==========================
educatorRouter.get(
  "/courses",
  protectEducator,
  getEducatorCourses
);

// ==========================
// DASHBOARD
// ==========================
educatorRouter.get(
  "/dashboard",
  protectEducator,
  educatorDashboardData
);

// ==========================
// ENROLLED STUDENTS
// ==========================
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentData
);

export default educatorRouter;