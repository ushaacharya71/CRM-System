import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import AttendanceSummary from "../components/AttendanceSummary";
import ManagerLeaveApproval from "../components/ManagerLeaveApproval";
import LeaveSummary from "./LeaveSummary";
import ApplyLeave from "./ApplyLeave";
import MyLeave from "./MyLeave";
import api from "../api/axios";
import TopPerformers from "../components/TopPerformers";
import BirthdayBanner from "../components/BirthdayBanner";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const role = loggedInUser?.role;

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= FETCH ASSIGNED USERS ================= */
  const fetchAssignedUsers = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];
      setAssignedUsers(normalized);
    } catch {
      setAssignedUsers([]);
    }
  };

  /* ================= FETCH ANNOUNCEMENTS ================= */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.announcements)
          ? res.data.announcements
          : [];
      setAnnouncements(normalized);
    } catch {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
    fetchAnnouncements();
  }, []);

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  const safeAssignedUsers = Array.isArray(assignedUsers)
    ? assignedUsers
    : [];
  const safeAnnouncements = Array.isArray(announcements)
    ? announcements
    : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100">
      <Sidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
        <Navbar
          user={loggedInUser}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ================= HERO ================= */}
        <section className="mt-6 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-6 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {loggedInUser.name}
              </h1>
              <p className="text-white/80 mt-1">
                Command your team and track performance.
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate("/manager/stipend")}
                  className="bg-white text-orange-600 px-5 py-2 rounded-xl font-semibold shadow hover:bg-orange-50"
                >
                  Manage Stipends
                </button>

                <button
                  onClick={() => navigate("/manager/revenue")}
                  className="bg-black/20 hover:bg-black/30 px-5 py-2 rounded-xl font-semibold"
                >
                  Update Revenue
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{loggedInUser.email}</p>
                <p className="text-white/80 text-sm">
                  {loggedInUser.teamName || "No team assigned"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ATTENDANCE ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <AttendancePanel />
          <AttendanceSummary />
        </section>

        <BirthdayBanner />

        {/* ================= LEAVE ================= */}
        {role === "manager" && (
          <section className="mt-10 bg-white border shadow-sm p-6 rounded-3xl">
            <h2 className="text-xl font-semibold text-orange-600 mb-4">
              Leave Management
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <LeaveSummary />
              <ApplyLeave />
              <MyLeave />
            </div>
          </section>
        )}

        {/* ================= PERFORMANCE ================= */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Performance Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopPerformers type="daily" title="Daily Leaders" />
            <TopPerformers type="weekly" title="Weekly Momentum" />
            <TopPerformers type="monthly" title="Monthly Champions" />
          </div>
        </section>

        {/* ================= APPROVAL ================= */}
        <section className="mt-12">
          <ManagerLeaveApproval />
        </section>

        {/* ================= TEAM ================= */}
        <section className="mt-12 bg-white border shadow-sm p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Assigned Team Members
          </h2>

          {safeAssignedUsers.length === 0 ? (
            <p className="text-sm text-gray-500">No users assigned.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {safeAssignedUsers.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3">{u.teamName || "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/manager/view-dashboard/${u._id}`)
                        }
                        className="text-orange-600 font-semibold"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* ================= ANNOUNCEMENTS ================= */}
        <section className="mt-12 bg-white border shadow-sm p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Company Announcements
          </h2>

          {safeAnnouncements.length === 0 ? (
            <p className="text-sm text-gray-500">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {safeAnnouncements.map((a) => (
                <div key={a._id} className="border p-4 rounded-xl">
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ManagerDashboard;
