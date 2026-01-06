import React, { useEffect, useState } from "react";
import api from "../api/axios";

const RevenueByManager = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics/revenue-by-manager")
      .then((res) => setData(res.data))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Revenue by Manager</h3>
      {data.map((d, i) => (
        <div key={i} className="flex justify-between border-b py-2">
          <span>{d.manager}</span>
          <span className="font-bold">₹{d.total}</span>
        </div>
      ))}
    </div>
  );
};

export default RevenueByManager;
