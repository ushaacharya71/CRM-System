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

      // ✅ NORMALIZE RESPONSE
      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.performance)
          ? res.data.performance
          : [];

      setPerformance(normalized);

      const sum = normalized.reduce(
        (acc, item) => acc + Number(item?.amount || 0),
        0
      );

      setTotalRevenue(sum);
    } catch (err) {
      console.error("Error fetching performance:", err);
      setPerformance([]);
      setTotalRevenue(0);
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

  // ✅ FINAL SAFETY
  const safePerformance = Array.isArray(performance)
    ? performance
    : [];

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
        <section
          className="relative mt-6 overflow-hidden rounded-[28px]
          bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400
          text-white p-6 sm:p-8 shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome, {user?.name}
              </h1>
              <p className="text-sm text-white/85 mt-2 max-w-xl">
                View your attendance, track your revenue, and manage your leaves.
              </p>
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/20 rounded-full blur-3xl" />
        </section>

        {/* ================= ATTENDANCE ================= */}
        <section className="mt-10 rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-6">
          <h2 className="text-lg font-semibold text-orange-600 mb-4">
            Attendance Overview
          </h2>
          <AttendancePanel />
        </section>

        <BirthdayBanner />

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
            My Revenue Contribution
          </h2>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 shadow-xl mb-6">
            <p className="text-sm text-white/80">
              Total Revenue Generated
            </p>
            <p className="text-4xl font-bold mt-2">
              ₹ {totalRevenue}
            </p>
          </div>

          <div className="rounded-3xl bg-white border shadow-sm p-5">
            {safePerformance.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                No revenue data available
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={safePerformance}>
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

        {/* ================= LEAVE MANAGEMENT ================= */}
        {user.role === "employee" && (
          <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold text-orange-600">
              Leave Management
            </h2>

            <LeaveSummary />
            <ApplyLeave />
            <MyLeave />
          </section>
        )}

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

export default EmployeeDashboard;
