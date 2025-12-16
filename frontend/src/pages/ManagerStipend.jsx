import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ManagerStipend = () => {
  const [interns, setInterns] = useState([]);
  const [stipends, setStipends] = useState({});
  const [loading, setLoading] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Fetch interns assigned to this manager
  const fetchInterns = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      setInterns(res.data);
      fetchStipends(res.data);
    } catch {
      alert("Failed to load interns");
    }
  };

  // Fetch stipend for each intern
  const fetchStipends = async (internList) => {
    const stipendData = {};

    for (let intern of internList) {
      try {
        const salaryRes = await api.get(`/salary/${intern._id}`);
        const entry = salaryRes.data.find((r) => r.month === currentMonth);
        stipendData[intern._id] = entry ? entry.baseSalary : "";
      } catch {
        stipendData[intern._id] = "";
      }
    }

    setStipends(stipendData);
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Update stipend
  const handleUpdate = async (internId) => {
    const amount = stipends[internId];

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid stipend amount");
      return;
    }

    try {
      setLoading(true);

      await api.post("/salary/set", {
        userId: internId,
        baseSalary: Number(amount),
        bonus: 0,
        deductions: 0,
        month: currentMonth,
      });

      alert("✅ Stipend updated successfully!");
    } catch {
      alert("Failed to update stipend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Intern Stipend Management</h1>

      {interns.length === 0 ? (
        <p className="text-gray-500">No interns assigned to you.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">Intern</th>
                <th className="p-3 text-left">Stipend</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {interns.map((intern) => (
                <tr key={intern._id} className="border-b">
                  <td className="p-3 font-medium">{intern.name}</td>

                  <td className="p-3">
                    <input
                      type="number"
                      className="border p-2 rounded w-36"
                      value={stipends[intern._id] || ""}
                      placeholder="Enter stipend"
                      onChange={(e) =>
                        setStipends({
                          ...stipends,
                          [intern._id]: e.target.value,
                        })
                      }
                    />
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleUpdate(intern._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerStipend;
