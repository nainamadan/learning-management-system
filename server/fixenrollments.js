import mongoose from "mongoose";
import "dotenv/config";
import { Purchase } from "./models/Purchase.js";
import Course from "./models/Course.js";

await mongoose.connect(process.env.MONGODB_URI);

const purchases = await Purchase.find({});

for (const p of purchases) {
  await Course.findByIdAndUpdate(p.courseId, {
    $addToSet: { enrolledStudents: p.userId }
  });
}

console.log("Done! Enrollments fixed.");
process.exit();