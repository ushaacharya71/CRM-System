import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  baseSalary: { type: Number, required: true },  // Monthly fixed salary
  bonus: { type: Number, default: 0 },           // Incentives
  deductions: { type: Number, default: 0 },      // Penalties
  totalSalary: { type: Number, required: true }, // Calculated = base + bonus - deductions
  month: { type: String, required: true },       // e.g. "2025-11"
}, { timestamps: true });

export default mongoose.model("Salary", salarySchema);
