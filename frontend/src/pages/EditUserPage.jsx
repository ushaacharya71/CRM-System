import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { Save, ArrowLeft } from "lucide-react";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "intern",
    teamName: "",
    position: "",
    manager: "",
    joiningDate: "",
    birthday: "",
    avatar: "",
  });

  /* -----------------------------------
      FETCH USER + MANAGERS
  ----------------------------------- */
  useEffect(() => {
    fetchUser();
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/users");
      setManagers(res.data.filter((u) => u.role === "manager"));
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      const u = res.data;

      setForm({
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        role: u.role || "intern",
        teamName: u.teamName || "",
        position: u.position || "",
        manager: u.manager ? u.manager._id : "",
        joiningDate: u.joiningDate ? u.joiningDate.split("T")[0] : "",
        birthday: u.birthday ? u.birthday.split("T")[0] : "",
        avatar: u.avatar || "",
      });
    } catch (error) {
      console.error("Error loading user:", error);
      alert("Failed to load user details");
    }
  };

  /* -----------------------------------
            INPUT HANDLER
  ----------------------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -----------------------------------
            SUBMIT HANDLER
  ----------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Intern must have a manager
    if (form.role === "intern" && !form.manager) {
      alert("Please assign a manager to an intern.");
      return;
    }

    try {
      await api.put(`/users/${id}`, form);
      alert("✅ User updated successfully!");
      navigate("/admin/manage-users");
    } catch (error) {
      console.error("Error updating:", error);
      alert(error.response?.data?.message || "❌ Failed to update user");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
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

          {/* EMAIL (NOT EDITABLE) */}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            disabled
            className="border rounded-lg p-2 bg-gray-100"
          />

          {/* PHONE */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
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
            <option value="employee">Probation Employee</option>
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

              {/* Team */}
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

          {/* EMPLOYEE FIELDS */}
          {form.role === "employee" && (
            <>
              <input
                type="text"
                name="position"
                placeholder="Job Position"
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
            placeholder="Avatar URL"
            value={form.avatar}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          {/* SAVE BUTTON */}
          <button
            type="submit"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg gap-2 transition"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
