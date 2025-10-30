import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import AttendanceSummary from "../components/AttendanceSummary";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const EmployeeDashboard = () => {
  const [user, setUser] = useState(null);

  const teamData = [
    { name: "Aman", revenue: 4000 },
    { name: "Pooja", revenue: 3500 },
    { name: "Ravi", revenue: 2700 },
    { name: "Kavya", revenue: 5100 },
  ];

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

        {/* ✅ Attendance System Added Here */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Attendance</h2>
        <AttendancePanel />

        {/* Team Performance */}
        <h2 className="text-2xl font-bold text-gray-700 mt-10 mb-4">
          Team Performance
        </h2>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
          <AttendanceSummary />
        </div>

        {/* Intern List */}
        <h2 className="text-xl font-semibold mb-3">Intern Revenue Update</h2>
        <div className="bg-white rounded-xl shadow-md p-5">
          {teamData.map((member, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b py-2"
            >
              <span className="font-medium">{member.name}</span>
              <input
                type="number"
                defaultValue={member.revenue}
                className="border rounded p-1 w-24 text-center"
              />
              <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Update
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
