import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AnalyticsCards from "../components/AnalyticsCards";
import RevenueChart from "../components/RevenueChart";
import TeamPerformanceChart from "../components/TeamPerformanceChart";
import AnnouncementList from "../components/AnnouncementList";
import AddAnnouncement from "../components/AddAnnouncement";
import api from "../api/axios";
import ManageUsers from "../components/ManageUsers";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    employees: 0,
    interns: 0,
    managers: 0,
    revenue: 0,
    activeToday: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);

    const fetchStats = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setStats(res.data);
      } catch (err) {
        console.warn(
          "Analytics API missing → Dashboard lite mode enabled",
          err.message
        );
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={user} />

        <AnalyticsCards data={stats} />

        <RevenueChart />

        <TeamPerformanceChart />

        <div className="mt-8">
          <AddAnnouncement />
          <AnnouncementList />
          <ManageUsers />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
