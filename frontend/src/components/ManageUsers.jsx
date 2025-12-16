import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Pencil, Trash2, UserPlus, Eye } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all"); // NEW FILTER
  const navigate = useNavigate();

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      alert("User deleted successfully");
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Add User
  const handleAddUser = () => navigate("/admin/add-user");

  // Edit User
  const handleEdit = (user) => navigate(`/admin/edit-user/${user._id}`);

  // View user profile
  const handleView = (user) => navigate(`/admin/user/${user._id}`);

  // FILTER LOGIC
  const filteredUsers =
    filter === "all" ? users : users.filter((u) => u.role === filter);

  // Count interns under each manager
  const getInternCount = (managerId) => {
    return users.filter((u) => u.manager === managerId).length;
  };

  // Get manager name for an intern
  const getManagerName = (managerId) => {
    const manager = users.find((u) => u._id === managerId);
    return manager ? manager.name : "—";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Manage Users</h2>

        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* FILTER DROPDOWN */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="manager">Managers</option>
          <option value="employee">Employees</option>
          <option value="intern">Interns</option>
        </select>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No users found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Team / Position</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Intern Count</th>
              <th className="p-3">Joined</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>

                {/* TEAM OR POSITION */}
                <td className="p-3">{u.teamName || u.position || "—"}</td>

                {/* MANAGER COLUMN */}
                <td className="p-3">
                  {u.role === "intern" || u.role === "employee"
                    ? getManagerName(u.manager)
                    : "—"}
                </td>

                {/* INTERN COUNT FOR MANAGERS */}
                <td className="p-3">
                  {u.role === "manager" ? getInternCount(u._id) : "—"}
                </td>

                {/* JOINING DATE */}
                <td className="p-3">
                  {u.joiningDate
                    ? new Date(u.joiningDate).toLocaleDateString()
                    : "—"}
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => handleView(u)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Profile"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => handleEdit(u)}
                    className="text-green-600 hover:text-green-800"
                    title="Edit User"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
