// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import { connectDB } from "./config/db.js";

// // ================= ROUTE IMPORTS =================
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import attendanceRoutes from "./routes/attendance.js";
// import announcementRoutes from "./routes/announcements.js";
// import revenueRoutes from "./routes/revenue.js";
// import analyticsRoutes from "./routes/analytics.js";
// import performanceRoutes from "./routes/performance.js";
// import salaryRoutes from "./routes/salary.js";
// import leaveRoutes from "./routes/leave.js";
// import birthdayRoutes from "./routes/birthday.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// // ================= ✅ CORS (FINAL FIX) =================
// app.use(
//   cors({
//     origin: true, // ✅ allow any origin dynamically (Vercel safe)
//     credentials: true,
//   })
// );

// // ✅ allow preflight requests
// app.options("*", cors());

// // ================= MIDDLEWARE =================
// app.use(express.json());

// // ================= DB CONNECTION =================
// connectDB(MONGO_URI);

// // ================= TEST ROUTE =================
// app.get("/hello", (req, res) => {
//   res.json({ message: "Hello from CRM backend" });
// });

// // ================= API ROUTES =================
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/announcements", announcementRoutes);
// app.use("/api/revenue", revenueRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/performance", performanceRoutes);
// app.use("/api/salary", salaryRoutes);
// app.use("/api/leaves", leaveRoutes);
// app.use("/api/birthday", birthdayRoutes);

// // ================= GLOBAL ERROR HANDLER =================
// app.use((err, req, res, next) => {
//   console.error("❌ Error:", err.stack);
//   res.status(500).json({
//     message: "Server Error",
//     error: err.message,
//   });
// });

// // ================= START SERVER =================
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
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

// ✅ User model (for admin recovery)
import User from "./models/User.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ================= ✅ CORS (FINAL FIX) =================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// allow preflight
app.options("*", cors());

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= DB CONNECTION =================
connectDB(MONGO_URI);

// ================= TEST ROUTE =================
app.get("/hello", (req, res) => {
  res.json({ message: "Hello from CRM backend" });
});


// ================= 🔐 DEV ADMIN RECOVERY (LOCAL ONLY) =================
if (process.env.NODE_ENV !== "production") {
  app.get("/dev/create-admin", async (req, res) => {
    try {
      const existingAdmin = await User.findOne({ role: "admin" });

      if (existingAdmin) {
        return res.json({
          message: "Admin already exists",
          email: existingAdmin.email,
        });
      }

      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await User.create({
        name: "Local Admin",
        email: "admin@local.dev",
        password: hashedPassword,
        role: "admin",
      });

      res.json({
        message: "Admin created successfully",
        email: admin.email,
        password,
      });
    } catch (err) {
      console.error("Admin seed error:", err);
      res.status(500).json({ error: err.message });
    }
  });
}

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
