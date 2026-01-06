import React, { useEffect, useState } from "react";
import api from "../api/axios";

const rankColors = {
  1: "bg-yellow-400",
  2: "bg-gray-300",
  3: "bg-orange-400",
};

const TopPerformers = ({ type, title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop();
  }, [type]);

  const fetchTop = async () => {
    try {
      const res = await api.get(`/performance/top?type=${type}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Top performer fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
        {title}
      </h3>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data available</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const rank = index + 1;
            const color = rankColors[rank] || "bg-blue-100";

            return (
              <div
                key={item.userId}
                className={`rounded-lg p-3 sm:p-4 ${color}`}
              >
                {/* CONTENT */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  {/* LEFT */}
                  <div className="text-center sm:text-left">
                    <p className="font-semibold text-sm sm:text-base">
                      #{rank} {item.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 capitalize">
                      {item.role}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="text-center sm:text-right">
                    <p className="font-bold text-base sm:text-lg">
                      ₹ {item.total}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
