// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true },

    // ⭐ FINAL ROLES (Admin, Manager, Probation, Intern)
    role: {
      type: String,
      enum: ["admin", "manager", "employee", "intern"],
      default: "intern",
    },

    phone: { type: String, default: "" },

    avatar: { type: String, default: "" },

    teamName: { type: String, default: "" }, // for interns & managers

    position: { type: String, default: "" }, // for employees only

    joiningDate: { type: Date, default: Date.now },

    birthday: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },

    /**
     * ⭐ MANAGER FIELD
     * Only interns or employees will have this assigned.
     * Managers will always have null here.
     */
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /**
     * ⭐ MANAGED INTERN LIST
     * Automatically updated when admin assigns interns.
     * Manager → Array of intern IDs
     * Intern → Empty
     */
    managedInterns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// 🔐 PASSWORD HASHING
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare Password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
