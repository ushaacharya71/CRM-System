import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import Announcements from "../components/Announcements";
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

const InternDashboard = () => {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    if (userData?._id) {
      fetchPerformance(userData._id);
    }
  }, []);

  // ✅ Fetch revenue performance from backend
  const fetchPerformance = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}/performance`);
      setPerformance(res.data);

      const sum = res.data.reduce((acc, item) => acc + item.amount, 0);
      setTotalRevenue(sum);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <Navbar user={user} />

        {/* Attendance */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Attendance</h2>
        <AttendancePanel />

        {/* Performance Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Performance Overview
          </h2>

          {/* Total Revenue */}
          <div className="bg-blue-600 text-white p-4 rounded-xl mb-4 shadow">
            <h3 className="text-lg font-semibold">
              Total Revenue Generated:
            </h3>
            <p className="text-3xl font-bold">₹ {totalRevenue}</p>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#fb923c"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Announcements */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Announcements
          </h2>
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
