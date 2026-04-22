import express from "express";
import {getUserData,userEnrolledCourses,purchaseCourse,updateUserCourseProgress,getUserCourseProgress,addUserRating,createUser } from '../controllers/userController.js'

const userRouter=express.Router();
userRouter.post('/create-user', createUser);
// /api/user/data token headers

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
// body raw json privide ["courseid:"iddd] and tokenand origin of home page
userRouter.post('/purchase',purchaseCourse)

userRouter.post('/update-course-progress',updateUserCourseProgress)

userRouter.post('/get-course-progress',getUserCourseProgress)
userRouter.post('/add-rating',addUserRating)
export default userRouter