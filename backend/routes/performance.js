// backend/routes/performance.js
import express from "express";
import mongoose from "mongoose";
import Revenue from "../models/Revenue.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * ------------------------------------------------
 * 📊 PERFORMANCE OVERVIEW (ADMIN / MANAGER)
 * ------------------------------------------------
 * Admin   → Overall company revenue (daily)
 * Manager → Team revenue (daily)
 */
router.get("/", protect, async (req, res) => {
  try {
    let matchStage = {};

    // 🔐 MANAGER → only team revenue
    if (req.user.role === "manager") {
      matchStage.manager = new mongoose.Types.ObjectId(req.user._id);
    }

    // ❌ Others not allowed
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const performanceData = await Revenue.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          totalRevenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      performanceData.map((p) => ({
        date: p._id,
        amount: p.totalRevenue,
      }))
    );
  } catch (error) {
    console.error("Performance route error:", error);
    res.status(500).json({
      message: "Server error fetching performance data",
      error: error.message,
    });
  }
});

/**
 * ------------------------------------------------
 * 🏆 TOP PERFORMERS (DAILY / WEEKLY / MONTHLY)
 * ------------------------------------------------
 * URL: /api/performance/top?type=daily|weekly|monthly
 */
router.get("/top", protect, async (req, res) => {
  try {
    const { type = "daily" } = req.query;

    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (type === "weekly") {
      startDate.setDate(startDate.getDate() - 6);
    }

    if (type === "monthly") {
      startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
    }

    const limit = type === "monthly" ? 5 : 3;

    const top = await Revenue.aggregate([
      {
        $match: {
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$user",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: limit },
    ]);

    const populated = await User.populate(top, {
      path: "_id",
      select: "name role avatar",
    });

    res.json(
      populated.map((p, index) => ({
        rank: index + 1,
        userId: p._id._id,
        name: p._id.name,
        role: p._id.role,
        avatar: p._id.avatar,
        total: p.total,
      }))
    );
  } catch (error) {
    console.error("Top performers error:", error);
    res.status(500).json({
      message: "Server error fetching top performers",
      error: error.message,
    });
  }
});

export default router;
