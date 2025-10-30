import React, { useState } from "react";
import api from "../api/axios"; // ✅ import our axios instance
import { toast } from "react-toastify"; // ✅ optional (for better alerts)
import "react-toastify/dist/ReactToastify.css";

const AttendancePanel = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [attendance, setAttendance] = useState({
    checkIn: null,
    lunchOut: null,
    lunchIn: null,
    breakOut: null,
    breakIn: null,
    checkOut: null,
  });

  const handleMark = async (type) => {
    try {
      if (!user || !user._id || !user.role) {
        toast.error("User not found. Please log in again.");
        return;
      }

      console.log("📩 Sending:", {
        userId: user._id,
        role: user.role,
        type,
      });

      const res = await api.post("/attendance/mark", {
        userId: user._id,
        role: user.role,
        type,
      });

      console.log("✅ Response:", res.data);

      // Update local UI
      setAttendance((prev) => ({
        ...prev,
        [type]: new Date().toLocaleTimeString(),
      }));

      toast.success(`✅ ${type.replace(/([A-Z])/g, " $1")} marked successfully!`);
    } catch (err) {
      console.error("❌ Error marking attendance:", err);
      const msg =
        err.response?.data?.message ||
        "Something went wrong while marking attendance.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Panel ({user?.role?.toUpperCase()})
      </h3>

      {/* Attendance Buttons */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(attendance).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleMark(key)}
            disabled={!!value}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              value
                ? "bg-green-100 text-green-600 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-400"
            }`}
          >
            {value
              ? `${key.replace(/([A-Z])/g, " $1")} ✅`
              : key.replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>

      {/* Attendance Status */}
      <div className="mt-6 border-t pt-4 text-sm text-gray-600">
        {Object.entries(attendance).map(([key, value]) => (
          <div key={key} className="flex justify-between mb-1">
            <span>{key.replace(/([A-Z])/g, " $1")}:</span>
            <span>{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePanel;
