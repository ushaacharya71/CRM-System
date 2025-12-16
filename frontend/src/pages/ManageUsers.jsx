import React, { useEffect, useState } from "react";
import api from "../utils/api";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
      if (isEdit) {
        await api.put(`/users/${selectedUser._id}`, data);
      } else {
        await api.post("/users", data);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Manage Users</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add New User
          </button>
        </div>

        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <UserModal
          user={selectedUser}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

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
