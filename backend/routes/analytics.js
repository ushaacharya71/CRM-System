import express from "express";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =====================================================
   ✅ ADMIN OVERVIEW
   GET /api/analytics/overview
===================================================== */
router.get("/overview", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const totalUsers = await User.countDocuments();
    const employees = await User.countDocuments({ role: "employee" });
    const interns = await User.countDocuments({ role: "intern" });
    const managers = await User.countDocuments({ role: "manager" });

    const today = new Date().toISOString().split("T")[0];
    const activeToday = await Attendance.countDocuments({ date: today });

    const revenueAgg = await Revenue.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalUsers,
      employees,
      interns,
      managers,
      activeToday,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ REVENUE CHART (DAY-WISE)
   GET /api/analytics/revenue
===================================================== */
router.get("/revenue", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await Revenue.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      data.map((d) => ({
        date: d._id,
        amount: d.amount,
      }))
    );
  } catch (error) {
    console.error("Revenue chart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   ✅ TEAM PERFORMANCE (TOTAL USER REVENUE)
   GET /api/analytics/performance
===================================================== */
router.get("/performance", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await Revenue.aggregate([
      {
        $group: {
          _id: "$user",
          revenue: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          role: "$user.role",
          revenue: 1,
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(data);
  } catch (error) {
    console.error("Performance analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   🔥 TOP PERFORMERS (DAY / WEEK / MONTH)
   GET /api/analytics/top-performers
===================================================== */
router.get("/top-performers", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const buildTopQuery = async (fromDate, limit) =>
      Revenue.aggregate([
        { $match: { date: { $gte: fromDate } } },
        {
          $group: {
            _id: "$user",
            revenue: { $sum: "$amount" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            role: "$user.role",
            revenue: 1,
          },
        },
      ]);

    const [todayTop, weeklyTop, monthlyTop] = await Promise.all([
      buildTopQuery(startOfToday, 3),
      buildTopQuery(startOfWeek, 3),
      buildTopQuery(startOfMonth, 5),
    ]);

    res.json({
      todayTop,
      weeklyTop,
      monthlyTop,
    });
  } catch (error) {
    console.error("Top performer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
