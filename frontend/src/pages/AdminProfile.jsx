import React, { useState } from "react";
import api from "../api/axios";
import { Save } from "lucide-react";

const AdminProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        User not found. Please login again.
      </div>
    );
  }

  const [form, setForm] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    avatar: storedUser.avatar || "",
  });

  const [saving, setSaving] = useState(false);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- SAVE PROFILE ---------------- */
  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await api.put(`/users/${storedUser._id}`, form);

      // ✅ normalize backend response
      const updatedUser =
        res.data?.user || res.data?.data || res.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(
        err.response?.data?.message ||
          "❌ Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile
        </h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src={form.avatar || "https://via.placeholder.com/100"}
            alt="avatar"
            className="w-24 h-24 rounded-full border object-cover"
          />

          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="border rounded-lg p-2 bg-gray-100"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center justify-center py-2 rounded-lg gap-2 transition ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
