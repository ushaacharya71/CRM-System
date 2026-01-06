import React, { useEffect, useState } from "react";
import api from "../api/axios";

const MyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data || []);
    } catch (error) {
      console.error("Failed to fetch my leaves", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-6 text-gray-500">
        Loading leave requests…
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        My Leave Requests
      </h3>

      {leaves.length === 0 ? (
        <p className="text-gray-500">No leave requests yet.</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">From</th>
                  <th className="p-3 border">To</th>
                  <th className="p-3 border">Days</th>
                  <th className="p-3 border">Reason</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Approved By</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td className="p-3 border capitalize">{l.type}</td>

                    <td className="p-3 border">
                      {new Date(l.fromDate).toLocaleDateString()}
                    </td>

                    <td className="p-3 border">
                      {new Date(l.toDate).toLocaleDateString()}
                    </td>

                    <td className="p-3 border text-center font-semibold">
                      {l.totalDays}
                    </td>

                    <td className="p-3 border">
                      {l.reason || "-"}
                    </td>

                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          l.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : l.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {l.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3 border">
                      {l.approvedBy
                        ? `${l.approvedBy.name} (${l.approvedBy.role})`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARDS ================= */}
          <div className="space-y-4 md:hidden">
            {leaves.map((l) => (
              <div
                key={l._id}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold capitalize">{l.type} Leave</p>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      l.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : l.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {l.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  📅 {new Date(l.fromDate).toLocaleDateString()} →{" "}
                  {new Date(l.toDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600">
                  Days: <strong>{l.totalDays}</strong>
                </p>

                <p className="text-sm text-gray-600">
                  Reason: {l.reason || "-"}
                </p>

                <p className="text-sm text-gray-600">
                  Approved By:{" "}
                  {l.approvedBy
                    ? `${l.approvedBy.name} (${l.approvedBy.role})`
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyLeave;
