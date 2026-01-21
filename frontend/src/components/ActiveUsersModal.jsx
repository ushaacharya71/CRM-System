import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ActiveUsersModal = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActiveUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/analytics/active-users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch active users", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
      <h3 className="font-semibold mb-4 text-gray-800">
        Active Users Today
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500 text-center">
          Loading active users…
        </p>
      ) : users.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          No active users right now.
        </p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex justify-between items-center
                py-2 px-2 rounded-lg
                border border-gray-100 hover:bg-gray-50 transition"
            >
              <span className="text-sm font-medium text-gray-700">
                {u.name || "—"}
              </span>
              <span className="text-xs text-gray-500">
                {u.team || u.teamName || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveUsersModal;
