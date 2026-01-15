import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TeamPerformanceChart = ({ data = [] }) => {
  const [chartType, setChartType] = useState("bar"); // bar | line

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100
      shadow-sm hover:shadow-lg transition-all duration-300 p-5 md:p-6"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            Team Performance
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Revenue contribution by team members
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl w-fit">
          {["bar", "line"].map((type) => (
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
              {type === "bar" ? "Bar" : "Line"}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
          No performance data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
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
                dataKey="revenue"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
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
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TeamPerformanceChart;
