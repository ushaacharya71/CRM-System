import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OverviewCards from "../components/OverviewCards";
import RevenueChart from "../components/RevenueChart";
import AnnouncementList from "../components/AnnouncementList";
import AttendanceSummary from "../components/AttendanceSummary";
import AdminAttendanceTable from "../components/AdminAttendanceTable";

const AdminDashboard = () => {
  const stats = useState({ employees: 8, interns: 12, revenue: 35000 });
  const [user, setUser] = useState(null);

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
        <OverviewCards stats={stats} />
        <RevenueChart />
         <AdminAttendanceTable />
        <AttendanceSummary />
        <AnnouncementList />
      </div>
    </div>
  );
};

export default AdminDashboard;
