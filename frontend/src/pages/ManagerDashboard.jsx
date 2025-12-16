import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [interns, setInterns] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ---------------------------------------------
      FETCH INTERN + PROBATION EMPLOYEE LIST
  --------------------------------------------- */
  const fetchInterns = async () => {
    try {
      const res = await api.get("/users/manager/interns"); // backend route only returns assigned users
      setInterns(res.data);
    } catch (error) {
      console.error("Error fetching interns:", error);
    }
  };

  /* ---------------------------------------------
      FETCH ANNOUNCEMENTS
  --------------------------------------------- */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  useEffect(() => {
    fetchInterns();
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Navbar user={user} />

        {/* ⭐ MANAGER PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800">Manager Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Manage your interns, probation employees, track performance & update stipends.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p className="text-gray-600 text-sm">Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p className="text-gray-600 text-sm">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
              <p className="text-gray-600 text-sm">Team</p>
              <p className="font-semibold">{user?.teamName || "No team assigned"}</p>
            </div>
          </div>

          {/* ⭐ Stipend Button */}
          <div className="mt-6">
            <button
              onClick={() => navigate("/manager/stipend")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Manage Intern Stipends
            </button>
          </div>
        </div>

        {/* ⭐ INTERN + PROBATION LIST */}
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Interns & Probation Employees
          </h3>

          {interns.length === 0 ? (
            <p className="text-gray-500">No users assigned to you yet.</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Role</th>
                  <th className="p-3 border">Team</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((user) => (
                  <tr key={user._id} className="border">
                    <td className="p-3 border">{user.name}</td>
                    <td className="p-3 border">{user.email}</td>
                    <td className="p-3 border capitalize">{user.role}</td>
                    <td className="p-3 border">{user.teamName}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => navigate(`/manager/intern/${user._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View Performance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ⭐ ANNOUNCEMENTS */}
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
                  className="border p-3 rounded-lg bg-gray-50 shadow-sm"
                >
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-gray-600 text-sm">{a.message}</p>
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
