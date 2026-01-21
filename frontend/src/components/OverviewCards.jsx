import React from "react";

const OverviewCards = ({ stats }) => {
  // ✅ SAFE DEFAULTS
  const data = {
    employees: stats?.employees ?? 0,
    interns: stats?.interns ?? 0,
    revenue: stats?.revenue ?? 0,
  };

  const cardStyles =
    "bg-white rounded-xl shadow-md p-5 w-full text-center";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className={cardStyles}>
        <h3 className="text-gray-500">Total Employees</h3>
        <p className="text-3xl font-bold text-blue-600">
          {data.employees}
        </p>
      </div>

      <div className={cardStyles}>
        <h3 className="text-gray-500">Total Interns</h3>
        <p className="text-3xl font-bold text-green-600">
          {data.interns}
        </p>
      </div>

      <div className={cardStyles}>
        <h3 className="text-gray-500">Revenue</h3>
        <p className="text-3xl font-bold text-purple-600">
          ₹{data.revenue}
        </p>
      </div>
    </div>
  );
};

export default OverviewCards;
