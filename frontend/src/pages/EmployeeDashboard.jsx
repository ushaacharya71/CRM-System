import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import Announcements from "../components/Announcements";
import api from "../api/axios";

import TopPerformers from "../components/TopPerformers";
import LeaveSummary from "./LeaveSummary";
import ApplyLeave from "./ApplyLeave";
import MyLeave from "./MyLeave";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) return;

    setUser(userData);
    fetchPerformance(userData._id);
  }, []);

  /* ---------------- FETCH DAILY REVENUE ---------------- */
  const fetchPerformance = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}/performance`);
      setPerformance(res.data || []);

      const sum = (res.data || []).reduce(
        (acc, item) => acc + Number(item.amount || 0),
        0
      );
      setTotalRevenue(sum);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64 bg-gray-100 min-h-screen">

        {/* NAVBAR */}
        <Navbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ================= ATTENDANCE ================= */}
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
          Attendance
        </h2>
        <AttendancePanel />

        {/* ================= TOP PERFORMERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <TopPerformers type="daily" title="🏅 Daily Top Performers" />
          <TopPerformers type="weekly" title="🔥 Weekly Top Performers" />
          <TopPerformers type="monthly" title="🏆 Monthly Top Performers" />
        </div>

        {/* ================= PERFORMANCE ================= */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
            Revenue Performance (Daily)
          </h2>

          {/* TOTAL REVENUE */}
          <div className="bg-blue-600 text-white p-4 rounded-xl mb-4 shadow">
            <h3 className="text-lg font-semibold">
              Total Revenue Generated
            </h3>
            <p className="text-3xl font-bold">
              ₹ {totalRevenue}
            </p>
          </div>

          {/* BAR CHART */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            {performance.length === 0 ? (
              <p className="text-gray-500 text-center">
                No revenue data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="amount"
                    fill="#60a5fa"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ================= LEAVE SYSTEM (EMPLOYEE ONLY) ================= */}
        {user.role === "employee" && (
          <div className="mt-10 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">
              Leave Management
            </h2>

            <LeaveSummary />
            <ApplyLeave />
            <MyLeave />
          </div>
        )}

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
            Announcements
          </h2>
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
