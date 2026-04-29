import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureId: String,
    lectureTitle: String,
    lectureDuration: Number,
    lectureUrl: String,
    isPreviewFree: Boolean,
    lectureOrder: Number,
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema(
  {
    chapterId: String,
    chapterOrder: Number,
    chapterTitle: String,
    chapterContent: [lectureSchema],
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseDescription: { type: String, required: true }, // ✅ IMPORTANT FIX
    courseThumbnail: String,
  isPublished: { type: Boolean, default: true },
    coursePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    courseContent: [chapterSchema],

    courseRating: [
      {
        userId: String,
        rating: Number,
      },
    ],

  educator: {
  type: String,  // Clerk ID string hai isliye String type
  ref: 'User'    // User model se reference
},

    enrolledStudents: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);