// backend/models/OfficeConfig.js
import mongoose from "mongoose";

const officeConfigSchema = new mongoose.Schema(
  {
    allowedIPs: {
      type: [String],
      default: [],
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OfficeConfig", officeConfigSchema);
