import express from "express";
import Salary from "../models/Salary.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import XLSX from "xlsx";
const router = express.Router();

/* ===========================
   SET / UPDATE SALARY
=========================== */
router.post("/set", protect, async (req, res) => {
  try {
    const { userId, baseSalary, bonus = 0, deductions = 0, month } = req.body;

    if (!userId || baseSalary === undefined || !month) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role === "manager") {
      if (String(targetUser.manager) !== String(req.user._id)) {
        return res.status(403).json({
          message: "Managers can update stipend only for their interns",
        });
      }
    } else if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const totalSalary =
      Number(baseSalary) + Number(bonus) - Number(deductions);

    let record = await Salary.findOne({ user: userId, month });

    if (record) {
      record.baseSalary = baseSalary;
      record.bonus = bonus;
      record.deductions = deductions;
      record.totalSalary = totalSalary;
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
        updatedBy: req.user._id,
      });
    }

    res.json({
      success: true,
      message: "Salary / stipend updated successfully",
      record,
    });
  } catch (error) {
    console.error("Salary update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   GET SALARY HISTORY
=========================== */
router.get("/:userId", protect, async (req, res) => {
  try {
    const records = await Salary.find({ user: req.params.userId }).sort({
      month: -1,
    });
    res.json(records);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   MANAGER → EXPORT SALARY EXCEL
=========================== */
router.get("/manager/export", protect, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const interns = await User.find({ manager: req.user._id }).select(
      "_id name email role"
    );

    const internIds = interns.map((i) => i._id);

    const salaries = await Salary.find({ user: { $in: internIds } })
      .populate("user", "name email role")
      .sort({ month: -1 });

    const rows = salaries.map((s) => ({
      Name: s.user.name,
      Email: s.user.email,
      Role: s.user.role,
      Month: s.month,
      "Base Salary": s.baseSalary,
      Bonus: s.bonus,
      Deductions: s.deductions,
      "Net Salary": s.totalSalary,
      "Updated At": s.updatedAt.toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salaries");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=manager-salary-report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: "Export failed" });
  }
});

export default router;
