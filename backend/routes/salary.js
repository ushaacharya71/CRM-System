import express from "express";
import Salary from "../models/Salary.js";
import Revenue from "../models/Revenue.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * Add or Update Salary / Stipend
 * Admin → anyone
 * Manager → ONLY their interns
 */
router.post("/set", protect, async (req, res) => {
  try {
    const { userId, baseSalary, bonus = 0, deductions = 0, month } = req.body;

    if (!userId || !baseSalary || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // ---- PERMISSION CHECK ----
    if (req.user.role === "manager") {
      if (String(targetUser.manager) !== String(req.user._id)) {
        return res
          .status(403)
          .json({ message: "You can update stipend only for your assigned interns" });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Salary vs Stipend
    const paymentType = targetUser.role === "intern" ? "stipend" : "salary";

    const totalSalary =
      Number(baseSalary) + Number(bonus) - Number(deductions);

    // ---- UPSERT salary/stipend for that month ----
    let record = await Salary.findOne({ user: userId, month });

    if (record) {
      record.baseSalary = baseSalary;
      record.bonus = bonus;
      record.deductions = deductions;
      record.totalSalary = totalSalary;
      record.type = paymentType;
      record.updatedBy = req.user._id;
      await record.save();
    } else {
      record = await Salary.create({
        user: userId,
        baseSalary,
        bonus,
        deductions,
        totalSalary,
        month,
        type: paymentType,
        updatedBy: req.user._id,
      });
    }

    // ---- SYNC WITH REVENUE COLLECTION ----
    await Revenue.findOneAndUpdate(
      {
        user: userId,
        type: paymentType,
        description: `${paymentType} for ${month}`,
      },
      {
        user: userId,
        amount: totalSalary,
        type: paymentType,
        description: `${paymentType} for ${month}`,
        manager: req.user.role === "manager" ? req.user._id : null,
        date: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `${paymentType} updated successfully`,
      record,
    });
  } catch (error) {
    console.error("Salary/Stipend Update Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

/**
 * Get salary/stipend history for one user
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const records = await Salary.find({ user: req.params.userId }).sort({
      month: -1,
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
