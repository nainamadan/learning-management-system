import mongoose from "mongoose";

const { Schema } = mongoose;

/* ===============================
   Lecture Schema
=================================*/
const lectureSchema = new Schema(
  {
    lectureId: {
      type: String,
      required: true
    },
    lectureTitle: {
      type: String,
      required: true,
      trim: true
    },
    lectureDuration: {
      type: Number,
      required: true,
      min: 0
    },
    lectureUrl: {
      type: String,
      required: true
    },
    isPreviewFree: {
      type: Boolean,
      default: false
    },
    lectureOrder: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

/* ===============================
   Chapter Schema
=================================*/
const chapterSchema = new Schema(
  {
    chapterId: {
      type: String,
      required: true
    },
    chapterOrder: {
      type: Number,
      required: true
    },
    chapterTitle: {
      type: String,
      required: true,
      trim: true
    },
    chapterContent: {
      type: [lectureSchema],
      default: []
    }
  },
  { _id: false }
);

/* ===============================
   Course Schema
=================================*/
const courseSchema = new Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true
    },
    courseDescription: {
      type: String,
      required: true
    },
    courseThumbnail: {
      type: String
    },
    coursePrice: {
      type: Number,
      required: true,
      min: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    /* Chapters */
    courseContent: {
      type: [chapterSchema],
      default: []
    },

    /* Ratings */
   /* Ratings */
courseRating: [
  {
    userId: {
      type: String,   // ✅ changed
      ref: "User"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }
],
    /* Educator */
    educator: {
  type: String,   // ✅ changed
  ref: "User",
  required: true
},

    /* data of Enrolled Students */
   enrolledStudents: [
  {
    type: String,   // ✅ changed
    ref: "User"
  }
]
  },
  {
    timestamps: true,
    minimize: false
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
