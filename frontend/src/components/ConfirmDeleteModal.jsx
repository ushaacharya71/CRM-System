import React from "react";
import { motion } from "framer-motion";

const ConfirmDeleteModal = ({ user, onClose, onConfirm, loading = false }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose} // click outside to close
    >
      <motion.div
        onClick={(e) => e.stopPropagation()} // prevent close on modal click
        className="bg-white p-6 rounded-xl shadow-xl text-center w-full max-w-sm"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-lg font-semibold mb-2">
          Delete User?
        </h3>

        <p className="text-gray-600 mb-5">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{user?.name}</span>?
          <br />
          <span className="text-xs text-red-500">
            This action cannot be undone.
          </span>
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400
              disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded text-white transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDeleteModal;
