import React, { useEffect, useState } from "react";
import api from "../api/axios";

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    api.get("/leave/pending").then((res) => setLeaves(res.data));
  }, []);

  const action = async (id, status) => {
    await api.post(`/leave/${id}/action`, { action: status });
    setLeaves(leaves.filter((l) => l._id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Pending Leaves</h2>

      {leaves.map((l) => (
        <div key={l._id} className="border-b py-2 flex justify-between">
          <div>
            <p>{l.user.name}</p>
            <p className="text-sm">{l.type} ({l.fromDate.slice(0,10)} → {l.toDate.slice(0,10)})</p>
          </div>

          <div>
            <button onClick={() => action(l._id, "approved")} className="mr-2 text-green-600">
              Approve
            </button>
            <button onClick={() => action(l._id, "rejected")} className="text-red-600">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveApproval;
