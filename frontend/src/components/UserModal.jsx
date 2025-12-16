// frontend/src/components/UserModal.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const UserModal = ({ user, isEdit, onClose, onSave, allUsers }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "intern",
    position: "",
    teamName: "",
    joiningDate: "",
    password: "",
    manager: "", // NEW FIELD
  });

  // Fetch only managers for dropdown
  const managerList = allUsers?.filter((u) => u.role === "manager") || [];

  useEffect(() => {
    if (user)
      setFormData({
        ...user,
        password: "",
        manager: user.manager?._id || user.manager || "",
      });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={isEdit}
          />

          {/* PHONE */}
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* ROLE DROPDOWN */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="intern">Intern</option>
          </select>

          {/* ROLE-BASED FIELDS */}

          {/* INTERN → must select manager + team name */}
          {formData.role === "intern" && (
            <>
              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Manager</option>
                {managerList.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="teamName"
                placeholder="Team Name"
                value={formData.teamName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </>
          )}

          {/* EMPLOYEE → show position + optional manager */}
          {formData.role === "employee" && (
            <>
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />

              <select
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">(Optional) Assign Manager</option>
                {managerList.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* MANAGER → show team name */}
          {formData.role === "manager" && (
            <input
              type="text"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* JOINING DATE */}
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />

          {/* PASSWORD ONLY WHILE CREATING */}
          {!isEdit && (
            <input
              type="password"
              name="password"
              placeholder="Set Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserModal;
