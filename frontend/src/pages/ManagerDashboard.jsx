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
      setAssignedUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  /* ================= FETCH ANNOUNCEMENTS ================= */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
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
          user={loggedInUser}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ================= MANAGER PROFILE ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Manager Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Manage employees, approve leaves, and track performance.
          </p>

          <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
            <img
              src={loggedInUser?.avatar || "/avatar.png"}
              alt="Manager Avatar"
              className="w-20 h-20 rounded-full border"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{loggedInUser?.name}</p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{loggedInUser?.email}</p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">Team</p>
                <p className="font-semibold">
                  {loggedInUser?.teamName || "Not Assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <button
              onClick={() => navigate("/manager/stipend")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold w-full md:w-auto"
            >
              Manage Employee Stipends
            </button>

            <button
              onClick={() => navigate("/manager/revenue")}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold w-full md:w-auto"
            >
              Update Revenue
            </button>
          </div>
        </div>

        {/* ================= ATTENDANCE ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <AttendancePanel />
          <AttendanceSummary />
        </div>

        {/* ================= MANAGER MY LEAVE ================= */}
        {role === "manager" && (
          <div className="bg-white rounded-xl shadow p-6 mt-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              My Leave
            </h3>

            <LeaveSummary />
            <ApplyLeave />
            <MyLeave />
          </div>
        )}

        {/* ================= TOP PERFORMERS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <TopPerformers type="daily" title="🏅 Daily Top Performers" />
          <TopPerformers type="weekly" title="🔥 Weekly Top Performers" />
          <TopPerformers type="monthly" title="🏆 Monthly Top Performers" />
        </div>

        {/* ================= EMPLOYEE LEAVE APPROVAL ================= */}
        <div className="mt-8">
          <ManagerLeaveApproval />
        </div>

        {/* ================= ASSIGNED USERS ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Assigned Employees
          </h3>

          {assignedUsers.length === 0 ? (
            <p className="text-gray-500">No users assigned to you.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Email</th>
                    <th className="p-3 border">Role</th>
                    <th className="p-3 border">Team</th>
                    <th className="p-3 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="p-3 border">{u.name}</td>
                      <td className="p-3 border">{u.email}</td>
                      <td className="p-3 border capitalize">{u.role}</td>
                      <td className="p-3 border">
                        {u.teamName || "-"}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() =>
                            navigate(`/manager/view-dashboard/${u._id}`)
                          }
                          className="text-blue-600 font-medium"
                        >
                          View Performance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ================= ANNOUNCEMENTS ================= */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Announcements
          </h3>

          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li
                  key={a._id}
                  className="border p-3 rounded-lg bg-gray-50"
                >
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
