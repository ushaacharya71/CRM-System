import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

const AttendanceSummary = () => {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`/attendance/summary/${user._id}`);
        setData(res.data.summary || []);
      } catch (err) {
        console.error("Error fetching attendance summary:", err);
      }
    };
    fetchSummary();
  }, [user._id]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-gray-700 font-semibold mb-4">
        Attendance Summary ({user.role.toUpperCase()})
      </h3>
      {data.length ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalHours" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No attendance data yet.</p>
      )}
    </div>
  );
};

export default AttendanceSummary;
