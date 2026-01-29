import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Leave config (NO usage stored here)
 * Usage is derived from Leave collection
 */
const leaveConfigSchema = {
  total: { type: Number, default: 6 },
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "manager", "employee", "intern"],
      default: "intern",
    },

    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },

    teamName: { type: String, default: "" },
    position: { type: String, default: "" },

    joiningDate: { type: Date, default: Date.now },
    birthday: { type: Date, default: null },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ LEAVE CONFIG ONLY (SOURCE OF TRUTH)
    leaves: {
      sick: leaveConfigSchema,
      casual: leaveConfigSchema,
    },

    managedInterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

/* =====================================================
   🔐 SAFE PRE-SAVE HOOK
===================================================== */
userSchema.pre("save", async function (next) {
  try {
    /* ---------- PASSWORD HASH ---------- */
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    /* ---------- LEAVE NORMALIZATION ---------- */
    if (this.isModified("role") || this.isNew) {
      if (this.role === "intern") {
        this.leaves = {
          sick: { total: 0 },
          casual: { total: 0 },
        };
      } else {
        // safety defaults for non-interns
        if (!this.leaves) {
          this.leaves = {
            sick: { total: 6 },
            casual: { total: 6 },
          };
        }
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

/* =====================================================
   🔐 PASSWORD CHECK
===================================================== */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
