import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RevenueChart from "../components/RevenueChart";
import AttendanceSummary from "../components/AttendanceSummary";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const ManagerViewDashboard = () => {
  const { id } = useParams(); // target user id
  const navigate = useNavigate();
  const manager = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!id) return;
    fetchUser();
    fetchPerformance();
    fetchAttendance();
  }, [id]);

  /* ================= FETCH USER ================= */
  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);

      // ✅ normalize user
      const normalized =
        res.data?.user || res.data?.data || res.data || null;

      setUser(normalized);
    } catch (err) {
      console.error("User fetch failed", err);
      setUser(null);
    }
  };

  /* ================= FETCH PERFORMANCE ================= */
  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/revenue/${id}`);

      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setPerformance(normalized);
    } catch (err) {
      console.error("Performance fetch failed", err);
      setPerformance([]);
    }
  };

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/summary/${id}`);

      const normalized =
        Array.isArray(res.data?.summary)
          ? res.data.summary
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      setAttendance(normalized);
    } catch (err) {
      console.error("Attendance fetch failed", err);
      setAttendance([]);
    }
  };

  /* ================= LOADING ================= */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  // ✅ final safety
  const safePerformance = Array.isArray(performance) ? performance : [];
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 sm:p-6 bg-gray-100 min-h-screen">
        <Navbar user={manager} />

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition mb-4"
        >
          <ArrowLeft size={18} />
          Back to Manager Dashboard
        </button>

        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow p-6 mb-6 border-l-4 border-orange-500"
        >
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 capitalize">
            {user.role}
          </span>
        </motion.div>

        {/* DATA GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REVENUE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h3 className="font-semibold text-gray-700 mb-3">
              💰 Revenue Performance
            </h3>
            <RevenueChart data={safePerformance} />
          </motion.div>

          {/* ATTENDANCE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h3 className="font-semibold text-gray-700 mb-3">
              🕒 Attendance Summary
            </h3>
            <AttendanceSummary data={safeAttendance} />
          </motion.div>
        </div>

        {/* NOTICE */}
        <div className="mt-6 text-xs text-gray-500 bg-orange-50 border border-orange-200 p-3 rounded-lg">
          🔒 This is a <strong>read-only view</strong>. Managers cannot edit
          revenue or attendance from this screen.
        </div>
      </div>
    </div>
  );
};

export default ManagerViewDashboard;
