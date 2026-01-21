import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ApplyLeave = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH LEAVE SUMMARY ================= */
  const fetchSummary = async () => {
    try {
      const res = await api.get("/leaves/summary");

      const data =
        res.data?.summary ||
        res.data?.data ||
        res.data ||
        null;

      setSummary(data);
    } catch (err) {
      console.error("Failed to load leave summary");
      setSummary(null);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  /* ❌ INTERN BLOCK */
  if (user?.role === "intern") {
    return null;
  }

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= CALCULATE DAYS ================= */
  const totalDays = (() => {
    if (!form.fromDate || !form.toDate) return 0;

    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);

    if (to < from) return 0;

    const diff =
      (to.setHours(0, 0, 0, 0) -
        from.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);

    return diff + 1;
  })();

  /* ================= BALANCE ================= */
  const remaining =
    form.type && summary
      ? summary?.[form.type]?.remaining ?? 0
      : null;

  const isExhausted =
    remaining !== null &&
    totalDays > 0 &&
    totalDays > remaining;

  /* ================= SUBMIT ================= */
  const submit = async () => {
    const { type, fromDate, toDate, reason } = form;

    if (!type || !fromDate || !toDate || !reason.trim()) {
      alert("All fields are required");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      alert("To date cannot be before from date");
      return;
    }

    if (!summary) {
      alert("Leave balance not loaded yet");
      return;
    }

    if (isExhausted) {
      alert("❌ Leave balance insufficient");
      return;
    }

    try {
      setLoading(true);

      await api.post("/leaves/apply", {
        type,
        fromDate,
        toDate,
        reason,
      });

      alert("✅ Leave applied successfully");

      setForm({
        type: "",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchSummary();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to apply leave"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">Apply Leave</h2>

      {/* LEAVE TYPE */}
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      >
        <option value="">Select Leave Type</option>
        <option value="sick">Sick Leave</option>
        <option value="casual">Casual Leave</option>
      </select>

      {/* BALANCE INFO */}
      {form.type && summary && (
        <p
          className={`text-sm mb-2 ${
            isExhausted
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          Remaining {form.type} leave: {remaining}
          {totalDays > 0 &&
            ` | Requested: ${totalDays} days`}
        </p>
      )}

      {/* FROM DATE */}
      <input
        type="date"
        name="fromDate"
        value={form.fromDate}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      />

      {/* TO DATE */}
      <input
        type="date"
        name="toDate"
        value={form.toDate}
        onChange={handleChange}
        className="border p-2 rounded w-full mb-3"
      />

      {/* REASON */}
      <textarea
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason for leave"
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={submit}
        disabled={loading || isExhausted || !summary}
        className={`px-4 py-2 rounded w-full text-white transition ${
          loading || isExhausted || !summary
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Leave"}
      </button>
    </div>
  );
};

export default ApplyLeave;
