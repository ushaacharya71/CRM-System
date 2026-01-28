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

      // ❌ MANAGER CANNOT CREATE ADMIN / MANAGER
      if (
        creatorRole === "manager" &&
        (role === "admin" || role === "manager")
      ) {
        return res.status(403).json({
          message: "Managers cannot create Admin or Manager accounts",
        });
      }

      // ✅ AUTO ASSIGN MANAGER
      if (["intern", "employee"].includes(role)) {
        if (creatorRole === "manager") {
          manager = req.user._id;
        } else if (!manager) {
          return res.status(400).json({
            message: "Intern/Employee must have a manager",
          });
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
        password: password || "Glow@123",
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
   ASSIGN / CHANGE MANAGER
================================ */
router.post(
  "/assign",
  protect,
  authorizeRoles("admin", "manager"),
  async (req, res) => {
    try {
      const { internId, managerId } = req.body;

      const user = await User.findById(internId);
      const manager = await User.findById(managerId);

      if (!user || !manager) {
        return res.status(404).json({ message: "User not found" });
      }

      if (manager.role !== "manager") {
        return res.status(400).json({ message: "Invalid manager" });
      }

      if (!["intern", "employee"].includes(user.role)) {
        return res
          .status(400)
          .json({ message: "Only intern/employee can be assigned" });
      }

      if (user.manager) {
        await User.findByIdAndUpdate(user.manager, {
          $pull: { managedInterns: user._id },
        });
      }

      user.manager = managerId;
      await user.save();

      await User.findByIdAndUpdate(managerId, {
        $addToSet: { managedInterns: user._id },
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Assign error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ===============================
   MANAGER → GET OWN INTERNS
================================ */
router.get(
  "/manager/interns",
  protect,
  authorizeRoles("manager"),
  async (req, res) => {
    try {
      const users = await User.find({ manager: req.user._id }).select(
        "name email role teamName joiningDate"
      );
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ===============================
   GET USER PROFILE
================================ */
router.get("/:id", protect, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    if (req.user.role === "admin") return res.json(targetUser);

    if (req.user._id.toString() === targetUser._id.toString())
      return res.json(targetUser);

    if (
      req.user.role === "manager" &&
      targetUser.manager?.toString() === req.user._id.toString()
    ) {
      return res.json(targetUser);
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   UPDATE USER (SAFE)
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

    // ✅ PASSWORD UPDATE (SAFE)
    if (req.body.password) {
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

    // ✅ VALIDATE AFTER UPDATE
    if (
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

/* ===============================
   PERFORMANCE (DAY-WISE)
================================ */
router.get("/:id/performance", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id &&
      !(
        req.user.role === "manager" &&
        user.manager?.toString() === req.user._id.toString()
      )
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const data = await Revenue.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.params.id) } },
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
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
