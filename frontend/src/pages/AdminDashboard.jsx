import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalyticsCards from "../components/AnalyticsCards";
import RevenueChart from "../components/RevenueChart";
import TeamPerformanceChart from "../components/TeamPerformanceChart";
import AnnouncementList from "../components/AnnouncementList";
import AddAnnouncement from "../components/AddAnnouncement";
import AdminLeaveApproval from "../components/AdminLeaveApproval";
import TopPerformers from "../components/TopPerformers";
import BirthdayBanner from "../components/BirthdayBanner";
import api from "../api/axios";
import ManagerRevenueCards from "../components/ManagerRevenueCards";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📅 Excel filters
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;
    setUser(u);
    fetchAdminAnalytics();
  }, []);

  /* ================= FETCH ANALYTICS ================= */
  const fetchAdminAnalytics = async () => {
    try {
      const [o, r, p] = await Promise.all([
        api.get("/analytics/overview"),
        api.get("/analytics/revenue"),
        api.get("/analytics/performance"),
      ]);

      // ✅ NORMALIZE RESPONSES
      const overview =
        typeof o.data === "object" && !Array.isArray(o.data)
          ? o.data
          : o.data?.data || {};

      const revenue =
        Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data?.data)
          ? r.data.data
          : [];

      const performance =
        Array.isArray(p.data)
          ? p.data
          : Array.isArray(p.data?.data)
          ? p.data.data
          : [];

      setStats(overview);
      setRevenueData(revenue);
      setPerformanceData(performance);
    } catch (err) {
      console.error("Admin analytics failed", err);
      setStats({});
      setRevenueData([]);
      setPerformanceData([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD LEAVE EXCEL ================= */
  const downloadLeaveExcel = async () => {
    try {
      const res = await api.get(
        `/leaves/export?month=${month}&year=${year}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `Leave_Report_${month}_${year}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Failed to download leave report");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) return null;

  // ✅ FINAL SAFETY
  const safeRevenueData = Array.isArray(revenueData)
    ? revenueData
    : [];

  const safePerformanceData = Array.isArray(performanceData)
    ? performanceData
    : [];

  return (
    <div className="flex min-h-screen bg-gray-200">
      {/* SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6 space-y-8">
        {/* NAVBAR */}
        <Navbar user={user} onMenuClick={() => setSidebarOpen(true)} />

        {/* 🎂 BIRTHDAY */}
        <BirthdayBanner />

        {/* 📊 ANALYTICS */}
        <section>
          <AnalyticsCards data={stats} loading={loading} />
        </section>

        {/* 📈 CHARTS */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Revenue Overview
            </h3>
            <RevenueChart data={safeRevenueData} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Team Performance
            </h3>
            <TeamPerformanceChart data={safePerformanceData} />
          </div>
        </section>

        {/* 👨‍💼 MANAGER REVENUE */}
        <section>
          <ManagerRevenueCards />
        </section>

        {/* 🏆 TOP PERFORMERS */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Top Performers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopPerformers type="daily" title="🏅 Daily" />
            <TopPerformers type="weekly" title="🔥 Weekly" />
            <TopPerformers type="monthly" title="🏆 Monthly" />
          </div>
        </section>

        {/* 📝 LEAVES */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Leave Approvals
            </h3>

            <div className="flex flex-wrap gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                onClick={downloadLeaveExcel}
                className="bg-green-600 hover:bg-green-700
                text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                ⬇ Download Excel
              </button>
            </div>
          </div>

          <AdminLeaveApproval />
        </section>

        {/* 📢 ANNOUNCEMENTS */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <AddAnnouncement />
          <AnnouncementList />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
