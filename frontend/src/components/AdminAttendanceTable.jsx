import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminAttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [role, setRole] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (start && end) {
        params.append("start", start);
        params.append("end", end);
      }

      const res = await api.get(
        `/attendance/filter?${params.toString()}`
      );

      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching filtered attendance:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h3 className="text-gray-700 font-semibold mb-4">
        Recent Attendance Records
      </h3>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          className="border rounded-lg p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="employee">Employee</option>
          <option value="intern">Intern</option>
        </select>

        <input
          type="date"
          className="border rounded-lg p-2"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="date"
          className="border rounded-lg p-2"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <button
          onClick={fetchAttendance}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Filtering..." : "Filter"}
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading...</p>
      ) : records.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Events</th>
              </tr>
            </thead>

            <tbody>
              {records.map((rec) => (
                <tr
                  key={rec._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-2">
                    {rec.user?.name || "—"}
                  </td>

                  <td className="px-4 py-2">
                    {rec.user?.email || "—"}
                  </td>

                  <td className="px-4 py-2 capitalize">
                    {rec.role || "—"}
                  </td>

                  <td className="px-4 py-2">
                    {rec.date
                      ? new Date(rec.date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-4 py-2">
                    {(rec.events || []).length > 0 ? (
                      rec.events.map((e, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-700
                          px-2 py-1 rounded-lg text-xs mr-2 mb-1"
                        >
                          {e.type
                            ?.replace(/([A-Z])/g, " $1")
                            ?.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No events
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No attendance records found.
        </p>
      )}
    </div>
  );
};

export default AdminAttendanceTable;
