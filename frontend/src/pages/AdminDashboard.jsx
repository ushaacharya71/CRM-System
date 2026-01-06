import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalyticsCards from "../components/AnalyticsCards";
import RevenueChart from "../components/RevenueChart";
import TeamPerformanceChart from "../components/TeamPerformanceChart";
import AnnouncementList from "../components/AnnouncementList";
import AddAnnouncement from "../components/AddAnnouncement";
import AdminLeaveApproval from "../components/AdminLeaveApproval";
import api from "../api/axios";
import TopPerformers from "../components/TopPerformers";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    employees: 0,
    interns: 0,
    managers: 0,
    activeToday: 0,
    revenue: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) return;

    setUser(userData);
    fetchAdminAnalytics();
  }, []);

  /* ================= REAL ANALYTICS ================= */
  const fetchAdminAnalytics = async () => {
    try {
      const [overviewRes, revenueRes, performanceRes] =
        await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/revenue"),
          api.get("/analytics/performance"),
        ]);

      setStats(overviewRes.data);
      setRevenueData(revenueRes.data);
      setPerformanceData(performanceRes.data);
    } catch (error) {
      console.error("Admin analytics failed:", error);
    } finally {
      setLoading(false);
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

        {/* ================= ANALYTICS CARDS ================= */}
        <AnalyticsCards data={stats} loading={loading} />

        {/* ================= REVENUE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
            Revenue Overview
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        {/* ================= TEAM PERFORMANCE ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
            Team Performance
          </h2>
          <TeamPerformanceChart data={performanceData} />
        </div>

        {/* ================= TOP PERFORMERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <TopPerformers type="daily" title="🏅 Daily Top Performers" />
          <TopPerformers type="weekly" title="🔥 Weekly Top Performers" />
          <TopPerformers type="monthly" title="🏆 Monthly Top Performers" />
        </div>

        {/* ================= LEAVE APPROVAL ================= */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Leave Approvals
            </h2>

            {/* <button
              onClick={() =>
                window.open("/api/leaves/export", "_blank")
              }
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full md:w-auto"
            >
              Download Leave Excel
            </button> */}
          </div>

          <AdminLeaveApproval />
        </div>

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="mt-8 bg-white rounded-xl shadow p-4 md:p-6">
          <AddAnnouncement />
          <AnnouncementList />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
