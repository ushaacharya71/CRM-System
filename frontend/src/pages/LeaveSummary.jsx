import React, { useEffect, useState } from "react";
import api from "../api/axios";

const LeaveSummary = () => {
  const [summary, setSummary] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/leaves/summary");
        setSummary(res.data); // ✅ trust backend only
      } catch (error) {
        console.error("Failed to fetch leave summary", error);
      }
    };

    fetchSummary();
  }, []);

  /* ❌ Interns do not have leave system */
  if (user?.role === "intern") {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-gray-500">
        Leave system is not applicable for interns.
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-gray-500">
        Loading leave summary...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Leave Balance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CASUAL */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600">Casual Leave</p>

          <p className="text-xl font-bold text-blue-600">
            {summary.casual.used} / {summary.casual.total}
          </p>

          <p className="text-sm text-gray-500">
            Remaining: {summary.casual.remaining}
          </p>

          {summary.casual.remaining === 0 && (
            <p className="text-xs text-red-500 mt-1">
              Casual leave exhausted
            </p>
          )}
        </div>

        {/* SICK */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <p className="text-sm text-gray-600">Sick Leave</p>

          <p className="text-xl font-bold text-red-600">
            {summary.sick.used} / {summary.sick.total}
          </p>

          <p className="text-sm text-gray-500">
            Remaining: {summary.sick.remaining}
          </p>

          {summary.sick.remaining === 0 && (
            <p className="text-xs text-red-500 mt-1">
              Sick leave exhausted
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveSummary;
