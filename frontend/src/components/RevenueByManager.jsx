import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";

const RevenueByManager = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await api.get(
          "/analytics/revenue-by-manager"
        );

        // ✅ Normalize response
        const normalized =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.revenue)
            ? res.data.revenue
            : [];

        setData(normalized);
      } catch {
        setData([]);
      }
    };

    fetchRevenue();
  }, []);

  // ✅ Extra guard before render
  const safeData = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">
        Revenue by Manager
      </h3>

      {safeData.length === 0 ? (
        <p className="text-sm text-gray-500">
          No revenue data available
        </p>
      ) : (
        safeData.map((d, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2"
          >
            <span>{d.manager || "—"}</span>
            <span className="font-bold">
              ₹{Number(d.total || 0).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default RevenueByManager;
