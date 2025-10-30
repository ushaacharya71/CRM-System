import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // ✅ Reference to User (intern, employee, or admin)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Role helps admin/employee filter quickly
    role: {
      type: String,
      enum: ["admin", "employee", "intern"],
      required: true,
    },

    // ✅ Date stored in YYYY-MM-DD format for easy grouping
    date: {
      type: String,
      required: true,
    },

    // ✅ Array of attendance events for the day
    events: [
      {
        type: {
          type: String,
          enum: [
            "checkIn",
            "lunchOut",
            "lunchIn",
            "breakOut",
            "breakIn",
            "checkOut",
          ],
          required: true,
        },
        time: {
          type: Date,
          required: true,
          default: Date.now,
        },
      },
    ],

    // ✅ Optional computed total hours
    totalHours: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Attendance", attendanceSchema);
