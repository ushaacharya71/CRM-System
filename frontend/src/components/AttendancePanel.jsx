import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AttendancePanel = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const emptyAttendance = {
    checkIn: null,
    lunchOut: null,
    lunchIn: null,
    breakOut: null,
    breakIn: null,
    checkOut: null,
  };

  const [attendance, setAttendance] = useState(emptyAttendance);
  const [blocked, setBlocked] = useState(false); // 🔒 wifi block
  const [errorMsg, setErrorMsg] = useState("");

  /* ===============================
     LOAD TODAY ATTENDANCE
  =============================== */
  useEffect(() => {
    if (!user?._id) return;

    const loadTodayAttendance = async () => {
      try {
        const res = await api.get("/attendance/me");
        const today = new Date().toISOString().split("T")[0];

        const todayRecord = res.data.find(
          (r) => r.date === today
        );
        if (!todayRecord) return;

        const updated = { ...emptyAttendance };
        todayRecord.events.forEach((e) => {
          updated[e.type] = new Date(
            e.time
          ).toLocaleTimeString();
        });

        setAttendance(updated);
      } catch (err) {
        console.warn("No attendance marked yet");
      }
    };

    loadTodayAttendance();
  }, [user?._id]);

  /* ===============================
     MARK ATTENDANCE
  =============================== */
  const handleMark = async (type) => {
    try {
      setErrorMsg("");

      await api.post("/attendance/mark", {
        userId: user._id,
        type,
      });

      setAttendance((prev) => ({
        ...prev,
        [type]: new Date().toLocaleTimeString(),
      }));

      toast.success(
        `${type.replace(/([A-Z])/g, " $1")} marked`
      );
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to mark attendance";

      toast.error(msg);
      setErrorMsg(msg);

      // 🔒 Detect office Wi-Fi restriction
      if (
        err.response?.status === 403 &&
        msg.toLowerCase().includes("office")
      ) {
        setBlocked(true);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Panel ({user?.role?.toUpperCase()})
      </h3>

      {/* 🔒 WIFI BLOCK MESSAGE */}
      {blocked && (
        <div className="mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-700 text-sm">
          🔒 Attendance can be marked only when connected to
          <strong> office Wi-Fi</strong>.
        </div>
      )}

      {/* ❌ ERROR (NON WIFI) */}
      {errorMsg && !blocked && (
        <p className="text-red-600 text-sm mb-3">
          {errorMsg}
        </p>
      )}

      {/* BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(attendance).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleMark(key)}
            disabled={!!value || blocked}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              value
                ? "bg-green-100 text-green-600 cursor-not-allowed"
                : blocked
                ? "bg-red-200 text-red-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-400"
            }`}
          >
            {value
              ? `${key.replace(/([A-Z])/g, " $1")} ✅`
              : key.replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>

      {/* STATUS */}
      <div className="mt-6 border-t pt-4 text-sm text-gray-600">
        {Object.entries(attendance).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>
              {key.replace(/([A-Z])/g, " $1")}:
            </span>
            <span>{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendancePanel;
