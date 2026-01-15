import React from "react";
import { motion } from "framer-motion";

const AnalyticsCards = ({ data }) => {
  const cards = [
    {
      title: "Total Users",
      value: data.totalUsers || 0,
      accent: "from-blue-500 to-blue-600",
    },
    {
      title: "Employees",
      value: data.employees || 0,
      accent: "from-green-500 to-green-600",
    },
    {
      title: "Interns",
      value: data.interns || 0,
      accent: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Today",
      value: data.activeToday || 0,
      accent: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Total Revenue",
      value: `₹${data.revenue || 0}`,
      accent: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="relative bg-white rounded-2xl shadow-sm hover:shadow-lg
          transition-all duration-300 overflow-hidden"
        >
          {/* ACCENT STRIP */}
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
          />

          {/* CONTENT */}
          <div className="p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.title}
            </p>

            <h3 className="mt-2 text-2xl xl:text-3xl font-bold text-gray-800">
              {card.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
