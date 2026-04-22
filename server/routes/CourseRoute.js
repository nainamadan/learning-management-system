import express from "express";
import {getCourseId,getAllCourse} from '../controllers/CourseController.js'

const courseRouter=express.Router();
//   /api/course/all

courseRouter.get('/all',getAllCourse)
//  /api/course/iddddd
courseRouter.get('/:id',getCourseId)

export default courseRouter