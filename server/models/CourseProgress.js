import mongoose from "mongoose";

const { Schema } = mongoose;
const courseProgressSchema = new Schema({
  // property in progress data
  userId:{type:String,required:true},
  courseId:{type:String,required:true},
  completed:{type:Boolean,default:false},
  lectureCompleted:[
    // add list of lectures that are completed
  ]
},{minimize:false})
export const CourseProgress= mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;