import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminLeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/pending");
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Failed to fetch admin leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setProcessingId(id);
      await api.post(`/leaves/${id}/action`, { action });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 mt-8 text-gray-500">
        Loading manager leave requests…
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h2 className="text-xl font-semibold">
            Manager Leave Approvals
          </h2>
          <p className="text-sm text-gray-500">
            Review and approve manager leave requests
          </p>
        </div>

        {/* ✅ EXCEL DOWNLOAD */}
        <button
          onClick={() => window.open("/api/leaves/export", "_blank")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
        >
          Download Leave Excel
        </button>
      </div>

      {leaves.length === 0 ? (
        <p className="text-gray-500">
          ✅ No pending manager leave requests
        </p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Manager</th>
                  <th className="p-3 border">Team</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">From</th>
                  <th className="p-3 border">To</th>
                  <th className="p-3 border">Days</th>
                  <th className="p-3 border">Reason</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((l) => (
                  <tr key={l._id}>
                    <td className="p-3 border">{l.user.name}</td>
                    <td className="p-3 border">
                      {l.user.teamName || "-"}
                    </td>
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
                    <td className="p-3 border">{l.reason}</td>
                    <td className="p-3 border space-x-2">
                      <button
                        disabled={processingId === l._id}
                        onClick={() =>
                          handleAction(l._id, "approved")
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={processingId === l._id}
                        onClick={() =>
                          handleAction(l._id, "rejected")
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                      >
                        Reject
                      </button>
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
                  <p className="font-semibold">{l.user.name}</p>
                  <span className="capitalize text-sm text-gray-600">
                    {l.type}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Team: {l.user.teamName || "-"}
                </p>

                <p className="text-sm text-gray-600">
                  📅 {new Date(l.fromDate).toLocaleDateString()} →{" "}
                  {new Date(l.toDate).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-600">
                  Days: <strong>{l.totalDays}</strong>
                </p>

                <p className="text-sm text-gray-600">
                  Reason: {l.reason}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    disabled={processingId === l._id}
                    onClick={() =>
                      handleAction(l._id, "approved")
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={processingId === l._id}
                    onClick={() =>
                      handleAction(l._id, "rejected")
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLeaveApproval;
