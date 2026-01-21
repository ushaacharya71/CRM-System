import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AttendanceChart = ({ data = [] }) => {
  const [view, setView] = useState("bar"); // bar | line

  /* ---------------- NORMALIZE DATA ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((d, index) => ({
      date:
        d.date ||
        d._id ||
        `Day ${index + 1}`,
      hours:
        Number(d.hours) ||
        Number(d.totalHours) ||
        Number(d.value) ||
        0,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-6">
        No attendance data available
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* ================= VIEW TOGGLE ================= */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setView("bar")}
          className={`px-4 py-1 rounded text-sm font-medium transition ${
            view === "bar"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Bar
        </button>

        <button
          onClick={() => setView("line")}
          className={`px-4 py-1 rounded text-sm font-medium transition ${
            view === "line"
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Line
        </button>
      </div>

      {/* ================= CHART ================= */}
      <ResponsiveContainer width="100%" height={300}>
        {view === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v) => [`${v} hrs`, "Hours"]} />
            <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v) => [`${v} hrs`, "Hours"]} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
