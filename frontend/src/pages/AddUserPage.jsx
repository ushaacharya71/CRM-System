import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Save, ArrowLeft } from "lucide-react";

const AddUserPage = () => {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "intern",
    teamName: "",
    position: "",
    manager: "",
    joiningDate: "",
    birthday: "",
    avatar: "",
  });

  /** 🔹 Fetch Managers List */
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const res = await api.get("/users");
        setManagers(res.data.filter((u) => u.role === "manager"));
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();
  }, []);

  /** 🔹 Handle Input Change */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /** 🔹 Submit Form */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required Fields
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all required fields.");
      return;
    }

    // Intern must have manager
    if (form.role === "intern" && !form.manager) {
      alert("Please assign a manager to the intern.");
      return;
    }

    try {
      const res = await api.post("/users", form);
      alert(`✅ User ${res.data.user.name} created successfully!`);
      navigate("/admin/manage-users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(
        error.response?.data?.message || "❌ Failed to create user. Check console."
      );
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" /> Back
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* PHONE */}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={form.password}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Probation Period</option>
            <option value="intern">Intern</option>
          </select>

          {/* INTERN FIELDS */}
          {form.role === "intern" && (
            <>
              {/* Manager */}
              <select
                name="manager"
                value={form.manager}
                onChange={handleChange}
                className="border rounded-lg p-2"
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              {/* Team Name */}
              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
                value={form.teamName}
                onChange={handleChange}
                className="border rounded-lg p-2"
              />
            </>
          )}

          {/* PROBATION EMPLOYEE FIELDS */}
          {form.role === "employee" && (
            <>
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={form.position}
                onChange={handleChange}
                className="border rounded-lg p-2"
              />

              <select
                name="manager"
                value={form.manager}
                onChange={handleChange}
                className="border rounded-lg p-2"
              >
                <option value="">(Optional) Assign Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* MANAGER FIELDS */}
          {form.role === "manager" && (
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={form.teamName}
              onChange={handleChange}
              className="border rounded-lg p-2"
            />
          )}

          {/* JOINING DATE */}
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* BIRTHDAY */}
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* AVATAR URL */}
          <input
            type="text"
            name="avatar"
            placeholder="Avatar URL (optional)"
            value={form.avatar}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg gap-2 transition"
          >
            <Save size={18} /> Save User
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUserPage;
