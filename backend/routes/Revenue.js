import express from "express";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

/**
 * POST /api/revenue/add
 */
router.post("/add", protect, authorizeRoles("admin", "employee"), async (req, res) => {
  try {
    const { userId, amount, date } = req.body;

    if (!userId || !amount)
      return res.status(400).json({ message: "userId and amount are required" });

    const entry = await Revenue.create({
      user: userId,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * GET /api/revenue/:userId
 */
router.get("/:userId", protect, async (req, res) => {
  try {
    const entries = await Revenue.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
