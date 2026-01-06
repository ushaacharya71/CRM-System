import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ManagerStipend = () => {
  const [interns, setInterns] = useState([]);
  const [stipends, setStipends] = useState({});
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [loading, setLoading] = useState(false);

  /* ------------------------------------
     FETCH ASSIGNED INTERNS
  ------------------------------------ */
  const fetchInterns = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      setInterns(res.data);
      initializeStipends(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load interns");
    }
  };



 const downloadExcel = async () => {
  try {
    const res = await api.get("/salary/manager/export", {
      responseType: "blob", // 🔥 IMPORTANT
    });

    // Create file download
    const blob = new Blob([res.data], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "manager-stipend-report.xlsx";
    link.click();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Excel download failed:", error);
    alert("Failed to download Excel");
  }
};


  /* ------------------------------------
     INIT STIPEND STATE
  ------------------------------------ */
  const initializeStipends = (list) => {
    const data = {};
    list.forEach((i) => {
      data[i._id] = {
        baseSalary: "",
        bonus: "",
        deductions: "",
      };
    });
    setStipends(data);
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  /* ------------------------------------
     UPDATE STIPEND
  ------------------------------------ */
  const handleUpdate = async (internId) => {
    const { baseSalary, bonus, deductions } = stipends[internId];

    if (!baseSalary || Number(baseSalary) <= 0) {
      alert("Enter valid gross stipend");
      return;
    }

    try {
      setLoading(true);

      await api.post("/salary/set", {
        userId: internId,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus || 0),
        deductions: Number(deductions || 0),
        month,
      });

      alert("✅ Stipend updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update stipend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Intern Stipend Management</h1>

      {/* MONTH SELECTOR */}
      <div className="mb-6">
        <label className="font-medium mr-3">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {interns.length === 0 ? (
        <p className="text-gray-500">No interns assigned to you.</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border text-left">Intern</th>
                <th className="p-3 border">Gross Stipend</th>
                <th className="p-3 border">Incentives</th>
                <th className="p-3 border">Deductions</th>
                <th className="p-3 border">Net Payable</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {interns.map((intern) => {
                const s = stipends[intern._id] || {};
                const net =
                  Number(s.baseSalary || 0) +
                  Number(s.bonus || 0) -
                  Number(s.deductions || 0);

                return (
                  <tr key={intern._id} className="border-t">
                    <td className="p-3 font-medium">{intern.name}</td>

                    <td className="p-3">
                      <input
                        type="number"
                        className="border p-2 rounded w-32"
                        placeholder="Gross"
                        value={s.baseSalary}
                        onChange={(e) =>
                          setStipends({
                            ...stipends,
                            [intern._id]: {
                              ...s,
                              baseSalary: e.target.value,
                            },
                          })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        className="border p-2 rounded w-32"
                        placeholder="Incentives"
                        value={s.bonus}
                        onChange={(e) =>
                          setStipends({
                            ...stipends,
                            [intern._id]: {
                              ...s,
                              bonus: e.target.value,
                            },
                          })
                        }
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        className="border p-2 rounded w-32"
                        placeholder="Deductions"
                        value={s.deductions}
                        onChange={(e) =>
                          setStipends({
                            ...stipends,
                            [intern._id]: {
                              ...s,
                              deductions: e.target.value,
                            },
                          })
                        }
                      />
                    </td>

                    <td className="p-3 font-semibold">₹{net}</td>

                    <td className="p-3">
                      <button
                        onClick={() => handleUpdate(intern._id)}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        {loading ? "Saving..." : "Update"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br></br>
          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl mb-4"
          >
            Download Salary Excel
          </button>
        </div>

      )}

    </div>

  );
};

export default ManagerStipend;
