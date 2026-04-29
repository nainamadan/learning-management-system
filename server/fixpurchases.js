import mongoose from "mongoose";
import "dotenv/config";
import { Purchase } from "./models/Purchase.js";

await mongoose.connect(process.env.MONGODB_URI);
const result = await Purchase.updateMany({}, { $set: { status: "completed" } });
console.log("Updated:", result.modifiedCount);
process.exit();