import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "./RevenueChart";
import AttendanceSummary from "./AttendanceSummary";

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

  /* ================= FETCH ALL ================= */
  useEffect(() => {
    fetchUserData();
    fetchPerformance();
    fetchAttendance();
    fetchSalary();
  }, [id]);

  /* ================= API CALLS ================= */
  const fetchUserData = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch {
      alert("Failed to load user");
    }
  };

  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/users/${id}/performance`);
      setPerformance(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPerformance([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/summary/${id}`);
      setAttendance(res.data?.summary || []);
    } catch {
      setAttendance([]);
    }
  };

  const fetchSalary = async () => {
    try {
      const res = await api.get(`/salary/${id}`);
      setSalary(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSalary([]);
    }
  };

  /* ================= SALARY UPDATE ================= */
  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    if (!month || !baseSalary) {
      alert("Month and Base Salary are required");
      return;
    }

    try {
      await api.post("/salary/set", {
        userId: id,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus || 0),
        deductions: Number(deductions || 0),
        month,
      });

      alert("✅ Salary updated successfully");

      // reset
      setBaseSalary("");
      setBonus("");
      setDeductions("");
      setMonth("");

      fetchSalary();
    } catch {
      alert("❌ Failed to update salary");
    }
  };

  if (!user) {
    return <p className="p-6 text-gray-500">Loading profile…</p>;
  }

  /* ================= PERMISSIONS ================= */
  const canManageSalary =
    loggedInUser?.role === "admin" || loggedInUser?.role === "manager";

  const hideSalaryFor =
    user.role === "intern" || user.role === "employee";

  /* ================= UI ================= */
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      {/* PROFILE */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={user.name}
            className="w-20 h-20 rounded-full border object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500">
              {user.teamName || user.position || "—"}
            </p>
            <p className="text-sm text-gray-500">
              Joined{" "}
              {user.joiningDate
                ? new Date(user.joiningDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4">Revenue Performance</h3>
          <RevenueChart data={performance} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4">Attendance Summary</h3>
          <AttendanceSummary data={attendance} />
        </div>
      </div>

      {/* SALARY SECTION */}
      {canManageSalary && !hideSalaryFor && (
        <div className="bg-white p-6 rounded-xl shadow-md mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Salary / Stipend Management
          </h3>

          <form
            onSubmit={handleSalarySubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="number"
              placeholder="Base Salary"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Bonus"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Deductions"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded"
            />

            <button
              type="submit"
              className="col-span-2 bg-blue-600 hover:bg-blue-700
              text-white py-2 rounded"
            >
              Update Salary
            </button>
          </form>

          {/* HISTORY */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Salary History</h4>

            {salary.length === 0 ? (
              <p className="text-gray-500">No salary records found.</p>
            ) : (
              <ul className="space-y-3">
                {salary.map((s) => (
                  <li
                    key={s._id}
                    className="border p-3 rounded-lg bg-gray-50"
                  >
                    <p className="font-medium">{s.month}</p>
                    <p>Base: ₹{s.baseSalary}</p>
                    <p>Bonus: ₹{s.bonus}</p>
                    <p>Deductions: ₹{s.deductions}</p>
                    <p className="font-semibold">
                      Total: ₹{s.totalSalary}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
