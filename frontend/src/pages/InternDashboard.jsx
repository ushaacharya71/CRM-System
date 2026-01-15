import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import Announcements from "../components/Announcements";
import api from "../api/axios";
import TopPerformers from "../components/TopPerformers";
import BirthdayBanner from "../components/BirthdayBanner";

import {
  BarChart,
  Bar,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) return;

    setUser(userData);
    fetchPerformance(userData._id);
  }, []);

  /* ---------------- FETCH PERFORMANCE ---------------- */
  const fetchPerformance = async (userId) => {
    try {
      const res = await api.get(`/users/${userId}/performance`);
      const data = res.data || [];
      setPerformance(data);

      const sum = data.reduce(
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
  <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100">
    {/* SIDEBAR */}
    <Sidebar
      onLogout={handleLogout}
      isOpen={sidebarOpen}
      setIsOpen={setSidebarOpen}
    />

    {/* MAIN */}
    <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
      {/* NAVBAR */}
      <Navbar
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* ================= HERO ================= */}
      <section className="relative mt-6 overflow-hidden rounded-[28px]
        bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400
        text-white p-6 sm:p-8 shadow-2xl">

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-sm text-white/85 mt-2 max-w-xl">
              Track your attendance, performance, and contribution in real time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <img
              src="data:image/png;base64,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"
              alt="Intern Avatar"
              className="w-10 h-10 rounded-full
              border-4 border-white/40 shadow-xl object-cover"
            />
            <div className="text-sm">
              <p className="font-semibold">{user?.email}</p>
              <p className="text-white/80 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80
          bg-white/20 rounded-full blur-3xl" />
      </section>

      {/* ================= ATTENDANCE ================= */}
      <section className="mt-10 rounded-3xl bg-white/80 backdrop-blur
        border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
          Attendance Overview
        </h2>
        <AttendancePanel />
      </section>

      {/* ================= TOP PERFORMERS ================= */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
          Team Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TopPerformers type="daily" title="Daily Leaders" />
          <TopPerformers type="weekly" title="Weekly Momentum" />
          <TopPerformers type="monthly" title="Monthly Champions" />
        </div>
      </section>

      {/* ================= PERFORMANCE ================= */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
          My Contribution
        </h2>

        {/* TOTAL REVENUE CARD */}
        <div className="relative overflow-hidden rounded-3xl
          bg-gradient-to-r from-orange-500 to-amber-500
          text-white p-6 shadow-xl mb-6">

          <p className="text-sm text-white/80">
            Total Revenue Contributed
          </p>
          <p className="text-4xl font-bold mt-2">
            ₹ {totalRevenue}
          </p>

          <div className="absolute -bottom-10 -right-10 w-40 h-40
            bg-white/20 rounded-full blur-2xl" />
        </div>

        {/* PERFORMANCE CHART */}
        <div className="rounded-3xl bg-white border shadow-sm p-5">
          {performance.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No performance data available
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
                  fill="#fb923c"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <BirthdayBanner />

      {/* ================= ANNOUNCEMENTS ================= */}
      <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-orange-600 mb-4">
          Announcements
        </h2>
        <Announcements />
      </section>
    </div>
  </div>
);

};

export default InternDashboard;
