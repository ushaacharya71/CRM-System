import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
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

  // ✅ Static performance data for now
  const performanceData = [
    { week: "Week 1", revenue: 2000 },
    { week: "Week 2", revenue: 2500 },
    { week: "Week 3", revenue: 3000 },
    { week: "Week 4", revenue: 8200 },
  ];

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

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

        {/* Performance Chart */}
        <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-4">
          Performance
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;
