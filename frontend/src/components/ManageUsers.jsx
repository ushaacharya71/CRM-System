import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Pencil, Trash2, UserPlus, Eye } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      // ✅ SAFE NORMALIZATION
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.users)
        ? res.data.users
        : [];

      setUsers(list);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    }
  };

  /* ================= DELETE USER ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      alert("✅ User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("❌ Failed to delete user");
    }
  };

  /* ================= NAVIGATION ================= */
  const handleAddUser = () => navigate("/admin/add-user");
  const handleEdit = (user) => navigate(`/admin/edit-user/${user._id}`);
  const handleView = (user) => navigate(`/admin/user/${user._id}`);

  /* ================= FILTER ================= */
  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((u) => u.role === filter);
  }, [filter, users]);

  /* ================= HELPERS ================= */

  // Intern count for managers
  const getInternCount = (managerId) => {
    return users.filter(
      (u) =>
        (u.role === "intern" || u.role === "employee") &&
        (u.manager === managerId || u.manager?._id === managerId)
    ).length;
  };

  // Manager name for intern / employee
  const getManagerName = (manager) => {
    if (!manager) return "—";
    if (typeof manager === "object") return manager.name || "—";

    const m = users.find((u) => u._id === manager);
    return m ? m.name : "—";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Manage Users
        </h2>

        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
          text-white px-3 py-2 rounded-lg transition"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      {/* FILTER */}
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

      {/* TABLE */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
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
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>

                  <td className="p-3">
                    {u.teamName || u.position || "—"}
                  </td>

                  <td className="p-3">
                    {["intern", "employee"].includes(u.role)
                      ? getManagerName(u.manager)
                      : "—"}
                  </td>

                  <td className="p-3">
                    {u.role === "manager"
                      ? getInternCount(u._id)
                      : "—"}
                  </td>

                  <td className="p-3">
                    {u.joiningDate
                      ? new Date(u.joiningDate).toLocaleDateString()
                      : "—"}
                  </td>

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
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
