import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data }) => {
  const [chartType, setChartType] = useState("line");

  // ✅ Normalize incoming data ONCE
  const safeData = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.chartData)) return data.chartData;
    return [];
  }, [data]);

  // ✅ Safe reduce
  const totalRevenue = useMemo(() => {
    return safeData.reduce(
      (sum, item) => sum + Number(item?.amount || 0),
      0
    );
  }, [safeData]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Revenue Overview
          </h3>
          <p className="text-sm text-gray-500">
            Daily revenue performance
          </p>
        </div>

        <div className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          ₹ {totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* TOGGLE */}
      <div className="flex gap-2 mb-3">
        {["line", "bar"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* CHART */}
      {safeData.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-gray-400">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "line" ? (
            <LineChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={safeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#2563eb" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
