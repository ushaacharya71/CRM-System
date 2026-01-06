import express from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ================= APPLY LEAVE ================= */
router.post("/apply", protect, async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;

    if (!type || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findById(req.user._id);

    // ❌ Interns cannot apply
    if (user.role === "intern") {
      return res.status(403).json({
        message: "Interns are not allowed to apply for leave",
      });
    }

    if (!["sick", "casual"].includes(type)) {
      return res.status(400).json({ message: "Invalid leave type" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      return res
        .status(400)
        .json({ message: "To date cannot be before from date" });
    }

    const totalDays =
      Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const year = new Date().getFullYear();

    // ✅ Used leaves from DB (single source of truth)
    const usedAgg = await Leave.aggregate([
      {
        $match: {
          user: user._id,
          type,
          status: "approved",
          leaveYear: year,
        },
      },
      { $group: { _id: null, used: { $sum: "$totalDays" } } },
    ]);

    const used = usedAgg[0]?.used || 0;
    const totalAllowed = user.leaves[type].total;

    if (totalAllowed - used < totalDays) {
      return res.status(400).json({
        message: `${type} leave balance insufficient`,
      });
    }

    const overlap = await Leave.findOne({
      user: user._id,
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Leave overlaps with existing leave" });
    }

    const leave = await Leave.create({
      user: user._id,
      type,
      fromDate: start,
      toDate: end,
      reason,
      status: "pending",
    });

    res.json({ success: true, leave });
  } catch (err) {
    console.error("Apply leave error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= MY LEAVES ================= */
router.get("/my", protect, async (req, res) => {
  const leaves = await Leave.find({ user: req.user._id })
    .populate("approvedBy", "name role")
    .sort({ createdAt: -1 });

  res.json(leaves);
});

/* ================= LEAVE SUMMARY ================= */
router.get("/summary", protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role === "intern") {
    return res.json({
      casual: { total: 0, used: 0, remaining: 0 },
      sick: { total: 0, used: 0, remaining: 0 },
    });
  }

  const year = new Date().getFullYear();
  const summary = {};

  for (const type of ["casual", "sick"]) {
    const agg = await Leave.aggregate([
      {
        $match: {
          user: user._id,
          type,
          status: "approved",
          leaveYear: year,
        },
      },
      { $group: { _id: null, used: { $sum: "$totalDays" } } },
    ]);

    const used = agg[0]?.used || 0;
    const total = user.leaves[type].total;

    summary[type] = {
      total,
      used,
      remaining: Math.max(total - used, 0),
    };
  }

  res.json(summary);
});

/* ================= PENDING LEAVES (🔥 FIXED) ================= */
router.get("/pending", protect, async (req, res) => {
  try {
    let query = { status: "pending" };

    // 👔 Manager → only their employees
    if (req.user.role === "manager") {
      const employees = await User.find({
        manager: req.user._id,
        role: "employee",
      }).select("_id");

      query.user = { $in: employees.map((e) => e._id) };
    }

    // 🛡️ Admin → see ALL pending leaves (NO FILTER)
    // nothing to add here

    const leaves = await Leave.find(query)
      .populate("user", "name role teamName")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("Pending leave fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= APPROVE / REJECT ================= */
router.post("/:id/action", protect, async (req, res) => {
  try {
    const { action } = req.body;

    if (!["approved", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const leave = await Leave.findById(req.params.id).populate("user");
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    if (
      req.user.role === "manager" &&
      leave.user.manager?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.user.role === "admin" && leave.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    leave.status = action;
    leave.approvedBy = req.user._id;
    leave.approvedByRole = req.user.role;

    await leave.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Leave action error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
