import React, { useState } from "react";
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

const RevenueChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState("line");

  const totalRevenue = data.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100
      shadow-sm hover:shadow-lg transition-all duration-300 p-5 md:p-6"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Revenue Overview
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Daily revenue performance insights
          </p>
        </div>

        {/* TOTAL REVENUE */}
        <div
          className="px-5 py-2.5 rounded-xl
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white font-semibold text-sm shadow-md w-fit"
        >
          ₹ {totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* TOGGLE */}
      <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl w-fit mb-4">
        {["line", "bar"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
              ${
                chartType === type
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {type === "line" ? "Line" : "Bar"}
          </button>
        ))}
      </div>

      {/* CHART */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
          No revenue data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  background: "#ffffff",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                }}
                formatter={(value) => [`₹ ${value}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  background: "#ffffff",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                }}
                formatter={(value) => [`₹ ${value}`, "Revenue"]}
              />
              <Bar
                dataKey="amount"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueChart;
