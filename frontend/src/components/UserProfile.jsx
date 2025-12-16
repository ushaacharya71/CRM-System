import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import RevenueChart from "./RevenueChart";
import AttendanceSummary from "./AttendanceSummary";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const fetchSalary = async () => {
    try {
      const res = await api.get(`/salary/${id}`);
      setSalary(res.data);
    } catch (err) {
      console.error("Error fetching salary:", err);
    }
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/salary/set", {
        userId: id,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        deductions: Number(deductions),
        month,
      });

      alert("Salary updated successfully!");
      fetchSalary();
    } catch (err) {
      console.error("Error updating salary:", err);
      alert("Failed to update salary");
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchPerformance = async () => {
    try {
      const res = await api.get(`/users/${id}/performance`);
      setPerformance(res.data);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/users/${id}/attendance`);
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} className="mr-2" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt={user.name}
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            <p className="text-sm text-gray-500">
              {user.teamName || user.position || "—"}
            </p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.joiningDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">
            Revenue Performance
          </h3>
          <RevenueChart data={performance} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold mb-4 text-gray-800">
            Attendance Summary
          </h3>
          <AttendanceSummary data={attendance} />
        </div>
      </div>
      {/* ================= SALARY SECTION ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Salary Details
        </h3>

        {/* Salary Form - Only for Admin & Employee */}
        {(user.role === "admin" || user.role === "employee") && (
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
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 col-span-2"
            >
              Update Salary
            </button>
          </form>
        )}

        {/* Salary History */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Salary History</h4>

          {salary.length === 0 ? (
            <p className="text-gray-500">No salary records yet.</p>
          ) : (
            <ul className="space-y-3">
              {salary.map((s) => (
                <li key={s._id} className="border p-3 rounded-lg bg-gray-50">
                  <p className="font-semibold">{s.month}</p>
                  <p>Base Salary: ₹{s.baseSalary}</p>
                  <p>Bonus: ₹{s.bonus}</p>
                  <p>Deductions: ₹{s.deductions}</p>
                  <p className="font-bold">Total: ₹{s.totalSalary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
