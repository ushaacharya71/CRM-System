import React, { useEffect, useState } from "react";
import api from "../api/axios";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { motion } from "framer-motion";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");

      // ✅ SAFETY NORMALIZATION
      const normalized =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.users)
          ? res.data.users
          : [];

      setUsers(normalized);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= HANDLERS ================= */
  const handleAdd = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser._id}`);
      setShowDelete(false);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleSave = async (data) => {
    try {
      if (isEdit && selectedUser?._id) {
        await api.put(`/users/${selectedUser._id}`, data);
      } else {
        await api.post("/users", data);
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err.response?.data?.message || "Failed to save user");
    }
  };

  // ✅ FINAL SAFETY
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="p-3 sm:p-6 bg-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white shadow-xl rounded-2xl p-4 sm:p-6"
      >
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              👥 Manage Users
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Create, edit, assign roles & manage team structure
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="
              w-full sm:w-auto
              bg-gradient-to-r from-orange-500 to-orange-600
              text-white px-5 py-2.5 rounded-xl font-semibold
              hover:shadow-lg hover:scale-[1.02]
              transition-all
            "
          >
            + Add New User
          </button>
        </div>

        {/* TABLE */}
        <div className="relative -mx-4 sm:mx-0 overflow-x-auto">
          <div className="min-w-[700px] sm:min-w-full px-4 sm:px-0">
            <UserTable
              users={safeUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </motion.div>

      {/* USER MODAL */}
      {showModal && (
        <UserModal
          user={selectedUser}
          isEdit={isEdit}
          allUsers={safeUsers}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* DELETE CONFIRM */}
      {showDelete && (
        <ConfirmDeleteModal
          user={selectedUser}
          onClose={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ManageUsers;
