import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Revenue from "../models/Revenue.js";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const router = express.Router();

/* ===============================
   GET ALL USERS (ADMIN ONLY)
================================ */
router.get("/", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("manager", "name email role");

    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   CREATE USER (ADMIN / MANAGER)
================================ */
router.post(
  "/",
  protect,
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const creatorRole = req.user.role;

      let {
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

      // ❌ Manager cannot create admin / manager
      if (
        creatorRole === "manager" &&
        (role === "admin" || role === "manager")
      ) {
        return res.status(403).json({
          message: "Managers cannot create Admin or Manager accounts",
        });
      }

      // ✅ Auto-assign manager
      if (["intern", "employee"].includes(role)) {
        if (creatorRole === "manager") {
          manager = req.user._id;
        } else if (!manager) {
          return res
            .status(400)
            .json({ message: "Intern/Employee must have a manager" });
        }
      }

      if (!name || !email || !role) {
        return res.status(400).json({ message: "Required fields missing" });
      }

      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        phone,
        role,
        manager: ["intern", "employee"].includes(role) ? manager : null,
        position: role === "employee" ? position : "",
        teamName,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        birthday: birthday ? new Date(birthday) : null,
        password: password || "Glow@123", // hashed by model
      });

      await newUser.save();

      if (["intern", "employee"].includes(role)) {
        await User.findByIdAndUpdate(manager, {
          $addToSet: { managedInterns: newUser._id },
        });
      }

      const safeUser = newUser.toObject();
      delete safeUser.password;

      res.status(201).json({ success: true, user: safeUser });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ===============================
   UPDATE USER (✅ PASSWORD RESET FIXED)
================================ */
router.put("/:id", protect, async (req, res) => {
  try {
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔐 PASSWORD ONLY UPDATE (skip all validations)
    if (
      Object.keys(req.body).length === 1 &&
      typeof req.body.password === "string"
    ) {
      user.password = req.body.password; // model hashes
      await user.save();

      return res.json({ success: true });
    }

    const roleBefore = user.role;

    // 🔐 Normal password update
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = req.body.password;
    }

    const fields = [
      "name",
      "email",
      "phone",
      "role",
      "manager",
      "position",
      "teamName",
      "joiningDate",
      "birthday",
      "avatar",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // ✅ Validate only when role/manager actually changes
    const roleChanged = req.body.role && req.body.role !== roleBefore;
    const managerTouched = Object.prototype.hasOwnProperty.call(
      req.body,
      "manager"
    );

    if (
      (roleChanged || managerTouched) &&
      ["intern", "employee"].includes(user.role) &&
      !user.manager
    ) {
      return res
        .status(400)
        .json({ message: "Intern/Employee must have a manager" });
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   DELETE USER
================================ */
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });

      if (user.manager) {
        await User.findByIdAndUpdate(user.manager, {
          $pull: { managedInterns: user._id },
        });
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
