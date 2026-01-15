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
  const [blocked, setBlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    const loadTodayAttendance = async () => {
      try {
        const res = await api.get("/attendance/me");
        const today = new Date().toISOString().split("T")[0];

        const todayRecord = res.data.find((r) => r.date === today);
        if (!todayRecord) return;

        const updated = { ...emptyAttendance };
        todayRecord.events.forEach((e) => {
          updated[e.type] = new Date(e.time).toLocaleTimeString();
        });

        setAttendance(updated);
      } catch {
        console.warn("No attendance marked yet");
      }
    };

    loadTodayAttendance();
  }, [user?._id]);

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

      toast.success(`${type.replace(/([A-Z])/g, " $1")} marked`);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to mark attendance";

      toast.error(msg);
      setErrorMsg(msg);

      if (
        err.response?.status === 403 &&
        msg.toLowerCase().includes("office")
      ) {
        setBlocked(true);
      }
    }
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance
          </h3>
          <p className="text-sm text-gray-500">
            {user?.role?.toUpperCase()} · Today
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-medium
          bg-orange-50 text-orange-600 border border-orange-200">
          Live
        </span>
      </div>

      {/* WIFI BLOCK */}
      {blocked && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50
          text-red-700 text-sm p-3">
          🔒 Attendance can be marked only on <b>office Wi-Fi</b>.
        </div>
      )}

      {/* ERROR */}
      {errorMsg && !blocked && (
        <p className="text-sm text-red-600 mb-3">
          {errorMsg}
        </p>
      )}

      {/* ACTION GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(attendance).map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, " $1");

          return (
            <button
              key={key}
              onClick={() => handleMark(key)}
              disabled={!!value || blocked}
              className={`rounded-xl border p-4 text-left transition
                ${
                  value
                    ? "bg-green-50 border-green-200 text-green-700 cursor-not-allowed"
                    : blocked
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:border-orange-400 hover:shadow-sm"
                }`}
            >
              <p className="text-sm font-medium">
                {label}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                {value ? "Marked" : "Tap to mark"}
              </p>
            </button>
          );
        })}
      </div>

      {/* TIMELINE */}
      <div className="mt-8 border-t pt-5">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">
          Today’s Timeline
        </h4>

        <div className="space-y-2 text-sm">
          {Object.entries(attendance).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between text-gray-600"
            >
              <span>
                {key.replace(/([A-Z])/g, " $1")}
              </span>
              <span className="font-medium text-gray-900">
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AttendancePanel;
