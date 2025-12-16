// backend/models/Revenue.js
import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ NEW FIELD: Manager of this intern
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Manager can be null for Admin-created entries
    },

    amount: {
      type: Number,
      required: true,
    },

    // reason/type for revenue (salary, bonus, performance, etc.)
    type: {
      type: String,
      enum: ["salary", "bonus", "deduction", "other"],
      default: "salary",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);

export default Revenue;
