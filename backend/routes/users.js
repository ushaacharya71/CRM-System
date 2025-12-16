// backend/routes/users.js
import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

/* -----------------------------
   📌 GET ALL USERS (Admin only)
------------------------------ */
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("manager", "name email role");

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ------------------------------------
   📌 CREATE NEW USER (Admin only)
------------------------------------- */
router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      manager,
      position,
      teamName,
      joiningDate,
      password,
      birthday,
    } = req.body;

    if (!name || !email || !role)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      manager: role === "intern" ? manager : null,
      position,
      teamName,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      birthday: birthday || null,
      password: password || "Glow@123",
    });

    await newUser.save();

    // ⭐ If intern has manager → add into manager.managedInterns
    if (role === "intern" && manager) {
      await User.findByIdAndUpdate(manager, {
        $addToSet: { managedInterns: newUser._id },
      });
    }

    const safe = newUser.toObject();
    delete safe.password;

    res.json({ success: true, user: safe });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ----------------------------------------------------
   📌 ASSIGN INTERN TO MANAGER (Admin or Manager)
----------------------------------------------------- */
router.post("/assign", protect, authorizeRoles("admin", "manager"), async (req, res) => {
  try {
    const { internId, managerId } = req.body;

    const intern = await User.findById(internId);
    const manager = await User.findById(managerId);

    if (!intern || !manager)
      return res.status(404).json({ message: "User not found" });

    if (manager.role !== "manager")
      return res.status(400).json({ message: "Selected user is not a manager" });

    // Remove intern from old manager
    if (intern.manager) {
      await User.findByIdAndUpdate(intern.manager, {
        $pull: { managedInterns: internId },
      });
    }

    // Assign new manager
    intern.manager = managerId;
    await intern.save();

    await User.findByIdAndUpdate(managerId, {
      $addToSet: { managedInterns: internId },
    });

    res.json({ success: true, message: "Intern assigned successfully" });
  } catch (err) {
    console.error("Error assigning intern:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ------------------------------------------------
   📌 GET MANAGER → ASSIGNED INTERNS
------------------------------------------------- */
router.get("/manager/interns", protect, authorizeRoles("manager"), async (req, res) => {
  try {
    const interns = await User.find({ manager: req.user._id })
      .select("name email phone role teamName joiningDate");

    res.json(interns);
  } catch (err) {
    console.error("Error fetching interns:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ---------------------------------------
   📌 GET USER PROFILE (Admin or Self)
---------------------------------------- */
router.get("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id)
      return res.status(403).json({ message: "Unauthorized" });

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("manager", "name email role");

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ---------------------------------------
   📌 UPDATE USER (Admin or Self)
---------------------------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user._id.toString() !== id)
      return res.status(403).json({ message: "Unauthorized" });

    const allowedFields = [
      "name",
      "phone",
      "avatar",
      "teamName",
      "position",
      "joiningDate",
      "birthday",
      "password",
      "role",
      "manager",
    ];

    const updates = {};
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    /* ⭐ MANAGER CHANGE HANDLING */
    if (updates.manager) {
      const newMgr = await User.findById(updates.manager);
      if (!newMgr || newMgr.role !== "manager")
        return res.status(400).json({ message: "Invalid manager ID" });

      // Remove intern from old manager
      const oldUser = await User.findById(id);
      if (oldUser.manager) {
        await User.findByIdAndUpdate(oldUser.manager, {
          $pull: { managedInterns: id },
        });
      }

      // Add to new manager
      await User.findByIdAndUpdate(updates.manager, {
        $addToSet: { managedInterns: id },
      });
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true })
      .select("-password")
      .populate("manager", "name email role");

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* -----------------------------
   📌 DELETE USER (Admin only)
------------------------------ */
router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove intern from manager list if needed
    if (user.manager) {
      await User.findByIdAndUpdate(user.manager, {
        $pull: { managedInterns: user._id },
      });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* -------------------------------------------
   📌 GET USER PERFORMANCE (Admin / Manager)
-------------------------------------------- */
router.get("/:id/performance", protect, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== userId &&
      !(req.user.role === "manager" && user.manager?.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pipeline = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const perf = await Revenue.aggregate(pipeline);

    res.json(
      perf.map((p) => ({
        date: p._id,
        amount: p.total,
      }))
    );
  } catch (err) {
    console.error("Performance error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
