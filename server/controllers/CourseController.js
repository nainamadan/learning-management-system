import Course from "../models/Course.js"

// return all course
export const getAllCourse=async(req,resp)=>{
try {
  // courses that are published will be displayed on web page and t remobve somedata from it
  // populate provide all info of user
  const courses=await Course.find({isPublished:true}).select(['-courseContent','-enrolledStudents']).populate({path:'educator'})
  resp.json({success:true,courses})
} catch (error) {
  resp.json({success:false,message:error.message})
}
}


export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const courseData = await Course.findById(id).populate({
      path: "educator",
    });

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Show lectureUrl only if preview is free
    courseData.courseContent = courseData.courseContent.map((chapter) => {
      const updatedLectures = chapter.chapterContent.map((lecture) => {
        const lec = lecture.toObject();

        if (!lec.isPreviewFree) {
          delete lec.lectureUrl;
        }

        return lec;
      });

      return {
        ...chapter.toObject(),
        chapterContent: updatedLectures,
      };
    });

    // Locate the end of getCourseId in your controller
    res.json({
      success: true,
      coursedata: courseData, // ✅ Changed from 'courseData' to 'coursedata'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};     
