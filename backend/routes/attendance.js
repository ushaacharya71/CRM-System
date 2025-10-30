import express from "express";
import Attendance from "../models/Attendance.js";

const router = express.Router();

/**
 * ✅ POST /api/attendance/mark
 * Marks attendance events like checkIn, lunchOut, lunchIn, breakOut, breakIn, checkOut
 */
router.post("/mark", async (req, res) => {
  try {
    const { userId, role, type } = req.body;

    // ✅ Input validation
    if (!userId || !type || !role) {
      console.warn("⚠️ Missing required fields:", { userId, role, type });
      return res
        .status(400)
        .json({ message: "User ID, role, and type are required." });
    }

    // ✅ Ensure valid type
    const allowedTypes = [
      "checkIn",
      "lunchOut",
      "lunchIn",
      "breakOut",
      "breakIn",
      "checkOut",
    ];
    if (!allowedTypes.includes(type)) {
      return res
        .status(400)
        .json({ message: `Invalid attendance type: ${type}` });
    }

    // ✅ Get current date (YYYY-MM-DD)
    const date = new Date().toISOString().split("T")[0];

    // ✅ Find or create record
    let record = await Attendance.findOne({ user: userId, date });
    if (!record) {
      record = new Attendance({ user: userId, role, date, events: [] });
    }

    // ✅ Prevent duplicate same-type entries
    const alreadyMarked = record.events.some((e) => e.type === type);
    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: `${type} already marked for today.` });
    }

    // ✅ Add new attendance event
    record.events.push({ type, time: new Date() });
    await record.save();

    res.status(200).json({
      success: true,
      message: `${type} marked successfully.`,
      record,
    });
  } catch (error) {
    console.error("❌ Attendance marking error:", error);
    res.status(500).json({
      message: "Server error while marking attendance.",
      error: error.message,
    });
  }
});

/**
 * ✅ GET /api/attendance
 * Fetch all attendance records (admin use)
 */
router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("user", "name email role")
      .sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    res.status(500).json({
      message: "Server error while fetching records.",
      error: error.message,
    });
  }
});

/**
 * ✅ GET /api/attendance/summary/:userId
 * Fetch attendance summary for one user
 */
router.get("/summary/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const records = await Attendance.find({ user: userId }).sort({ date: -1 });

    if (!records.length) {
      return res.json({ totalDays: 0, summary: [] });
    }

    const summary = records.map((r) => {
      const checkIn = r.events.find((e) => e.type === "checkIn");
      const checkOut = r.events.find((e) => e.type === "checkOut");

      let hours = 0;
      if (checkIn && checkOut) {
        const diff = new Date(checkOut.time) - new Date(checkIn.time);
        hours = Math.round((diff / (1000 * 60 * 60)) * 10) / 10;
      }

      return {
        date: r.date,
        totalHours: hours,
        events: r.events,
      };
    });

    res.status(200).json({ totalDays: records.length, summary });
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({
      message: "Server error while generating summary.",
      error: error.message,
    });
  }
});

/**
 * ✅ GET /api/attendance/filter
 * Admin can filter attendance by role and date range
 * Example: /api/attendance/filter?role=intern&start=2025-10-25&end=2025-10-28
 */
router.get("/filter", async (req, res) => {
  try {
    const { role, start, end } = req.query;

    const query = {};
    if (role) query.role = role;
    if (start && end) query.date = { $gte: start, $lte: end };

    const records = await Attendance.find(query)
      .populate("user", "name email role")
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("❌ Error filtering attendance:", error);
    res.status(500).json({
      message: "Server error while filtering attendance.",
      error: error.message,
    });
  }
});

export default router;
