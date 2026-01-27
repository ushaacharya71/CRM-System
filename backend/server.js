import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// ================= ROUTE IMPORTS =================
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import announcementRoutes from "./routes/announcements.js";
import revenueRoutes from "./routes/revenue.js";
import analyticsRoutes from "./routes/analytics.js";
import performanceRoutes from "./routes/performance.js";
import salaryRoutes from "./routes/salary.js";
import leaveRoutes from "./routes/leave.js";
import birthdayRoutes from "./routes/birthday.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ================= ✅ CORS (FINAL FIX) =================
app.use(
  cors({
    origin: true, // ✅ allow any origin dynamically (Vercel safe)
    credentials: true,
  })
);

// ✅ allow preflight requests
app.options("*", cors());

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= DB CONNECTION =================
connectDB(MONGO_URI);

// ================= TEST ROUTE =================
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/birthday", birthdayRoutes);

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
