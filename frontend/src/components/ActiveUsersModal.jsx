import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ActiveUsersModal = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/analytics/active-users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Active Users Today</h3>
      {users.map((u, i) => (
        <div key={i} className="flex justify-between py-2 border-b">
          <span>{u.name}</span>
          <span>{u.team}</span>
        </div>
      ))}
    </div>
  );
};

export default ActiveUsersModal;
