import React, { useEffect, useState } from "react";
import api from "../api/axios";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PENDING LEAVES ================= */
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave/pending");

      // ✅ NORMALIZE RESPONSE (ALWAYS ARRAY)
      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.leaves)
          ? res.data.leaves
          : [];

      setLeaves(normalized);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
      setLeaves([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= ACTION ================= */
  const action = async (id, status) => {
    try {
      await api.post(`/leave/${id}/action`, { action: status });

      // ✅ SAFE UPDATE
      setLeaves((prev) =>
        Array.isArray(prev) ? prev.filter((l) => l._id !== id) : []
      );
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-gray-500">
        Loading pending leaves…
      </div>
    );
  }

  if (!Array.isArray(leaves) || leaves.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow text-gray-500">
        🎉 No pending leave requests
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Pending Leaves</h2>

      {leaves.map((l) => (
        <div
          key={l._id}
          className="border-b py-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">{l.user?.name || "—"}</p>
            <p className="text-sm text-gray-600">
              {l.type} (
              {new Date(l.fromDate).toLocaleDateString()} →{" "}
              {new Date(l.toDate).toLocaleDateString()})
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => action(l._id, "approved")}
              className="text-green-600 font-medium hover:underline"
            >
              Approve
            </button>
            <button
              onClick={() => action(l._id, "rejected")}
              className="text-red-600 font-medium hover:underline"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveApproval;
