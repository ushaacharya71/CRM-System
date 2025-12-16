import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Route Imports
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import announcementRoutes from "./routes/announcements.js";
import revenueRoutes from "./routes/revenue.js";        // ✅ Corrected import of the revenue routes and placement through this file and update on github
import analyticsRoutes from "./routes/analytics.js";
import performanceRoutes from "./routes/performance.js";
import salaryRoutes from "./routes/salary.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB(MONGO_URI);

// Test Route
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from CRM backend" });
});

// API Routes (ORDER MATTERS)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/revenue", revenueRoutes);      // ✅ MUST BE BEFORE /api/*
app.use("/api/analytics", analyticsRoutes);  // moved
app.use("/api/performance", performanceRoutes);
app.use("/api/salary", salaryRoutes);

// Global Error Handler (ALWAYS LAST)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
