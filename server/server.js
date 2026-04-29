import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebHooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/CourseRoute.js";
import userRouter from "./routes/UserRoute.js";

const app = express();

// ✅ Add this to stop the 304 Not Modified cache issue
app.set('etag', false); 

app.use(express.json());
// ... rest of your middleware
await connectDB();
await connectCloudinary();

// ====================
// Webhook Routes (RAW BODY FIRST)
// ====================

app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebHooks);

// ====================
// Normal Middlewares
// ====================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://learning-management-system-hazel-two.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(clerkMiddleware());

// ====================
// Routes
// ====================

app.get("/", (req, res) => {
  res.send("API working");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// ====================
// Server
// ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});