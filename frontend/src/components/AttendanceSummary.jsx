import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AttendanceSummary = ({ userId }) => {
  const [data, setData] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const targetUserId = userId || loggedInUser?._id;

  useEffect(() => {
    if (!targetUserId) return;

    const fetchSummary = async () => {
      try {
        const res = await api.get(
          `/attendance/summary/${targetUserId}`
        );

        // ✅ Normalize response
        const normalized =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.summary)
            ? res.data.summary
            : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        setData(normalized);
      } catch (err) {
        console.error(
          "Error fetching attendance summary:",
          err
        );
        setData([]);
      }
    };

    fetchSummary();
  }, [targetUserId]);

  // ✅ Extra safety for Recharts
  const safeData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Summary
      </h3>

      {safeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">
          No attendance data yet.
        </p>
      )}
    </div>
  );
};

export default AttendanceSummary;
