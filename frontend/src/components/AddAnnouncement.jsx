import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { Megaphone } from "lucide-react";

const AddAnnouncement = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/announcements/create", {
        ...form,
        adminId: user._id,
      });
      toast.success(res.data.message);
      setForm({ title: "", message: "", type: "general" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating announcement");
    }
  };

  return (
    <section className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-6 py-4 border-b bg-white rounded-t-2xl">
        <div className="bg-blue-100 p-2.5 rounded-xl">
          <Megaphone className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Create Announcement
          </h3>
          <p className="text-sm text-gray-500">
            Publish an official update for your organization
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-6 bg-white rounded-b-2xl"
      >
        {/* TITLE */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter announcement title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Message
          </label>
          <textarea
            placeholder="Write the announcement message here..."
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-3
              text-sm text-gray-800 leading-relaxed resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Category
          </label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="general">General</option>
            <option value="birthday">Birthday</option>
            <option value="work-anniversary">Work Anniversary</option>
            <option value="festival">Festival</option>
            <option value="event">Event</option>
          </select>
        </div>

        {/* ACTION */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2
              bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium
              px-6 py-2.5 rounded-lg
              transition shadow-sm"
          >
            Publish Announcement
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddAnnouncement;
