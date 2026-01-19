import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "../components/RevenueChart";
import AttendanceChart from "../components/AttendanceChart";
import defaultAvatar from "../assets/defaultavatar.png";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salary, setSalary] = useState([]);

  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [deductions, setDeductions] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetchUserData();
    fetchPerformance();
    fetchAttendance();
    fetchSalary();
  }, [id]);

  /* ---------------- FETCH New USER  ---------------- */
  const fetchUserData = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  /* ---------------- FETCH PERFORMANCE ---------------- */
  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/users/${id}/performance`);
      setPerformance(res.data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  /* ---------------- FETCH ATTENDANCE ---------------- */
  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/summary/${id}`);
      setAttendance(res.data.summary || []);
    } catch (err) {
      console.warn("Attendance not found");
      setAttendance([]);
    }
  };

  /* ---------------- FETCH SALARY ---------------- */
  const fetchSalary = async () => {
    try {
      const res = await api.get(`/salary/${id}`);
      setSalary(res.data);
    } catch (err) {
      setSalary([]);
    }
  };

  /* ---------------- UPDATE SALARY (ADMIN / MANAGER) ---------------- */
  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    if (!month) {
      alert("Please select month");
      return;
    }

    try {
      await api.post("/salary/set", {
        userId: id,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        deductions: Number(deductions),
        month,
      });

      alert("✅ Salary / Stipend updated");
      fetchSalary();
      setBaseSalary("");
      setBonus("");
      setDeductions("");
    } catch (err) {
      alert("Failed to update salary");
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  const canManageSalary =
    loggedInUser?.role === "admin" || loggedInUser?.role === "manager";

  const hideSalaryForUser = user.role === "intern" || user.role === "employee";

  return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* BACK */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
    >
      <ArrowLeft size={16} className="mr-2" /> Back to users
    </button>

    {/* ================= PROFILE HEADER ================= */}
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <img
          src={user.avatar || defaultAvatar}
          alt={user.name}
          className="w-24 h-24 rounded-full border object-cover"
        />

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">
            {user.name}
          </h2>
          <p className="text-sm text-gray-600">{user.email}</p>

          <div className="flex flex-wrap gap-3 mt-2">
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
              {user.role}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
              {user.teamName || user.position || "—"}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
              Joined {new Date(user.joiningDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </section>

    {/* ================= ANALYTICS ================= */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Revenue Performance
        </h3>
        <RevenueChart data={performance} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Attendance Overview
        </h3>
        <AttendanceChart data={attendance} />
      </div>
    </section>

    {/* ================= SALARY (ADMIN / MANAGER) ================= */}
    {canManageSalary && !hideSalaryForUser && (
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Salary / Stipend Management
        </h3>

        {/* FORM */}
        <form
          onSubmit={handleSalarySubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="number"
            placeholder="Base Amount"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Incentives"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Deductions"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="col-span-1 md:col-span-2
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              py-2.5 rounded-xl transition"
          >
            Update Salary
          </button>
        </form>

        {/* HISTORY */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Salary History
          </h4>

          {salary.length === 0 ? (
            <p className="text-sm text-gray-500">
              No salary records found.
            </p>
          ) : (
            <ul className="space-y-3">
              {salary.map((s) => (
                <li
                  key={s._id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{s.month}</span>
                    <span className="text-gray-900">
                      ₹{s.totalSalary}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 mt-2 grid grid-cols-2 gap-y-1">
                    <span>Base: ₹{s.baseSalary}</span>
                    <span>Bonus: ₹{s.bonus}</span>
                    <span>Deductions: ₹{s.deductions}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    )}
  </div>
);

};

export default UserProfile;
