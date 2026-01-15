import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     FETCH ANNOUNCEMENTS
  =============================== */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  /* ===============================
     DELETE ANNOUNCEMENT (ADMIN)
  =============================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;

    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error("Delete announcement failed:", error);
      alert("Failed to delete announcement");
    }
  };

  return (
    <section className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* HEADER */}
      <div className="px-5 py-4 border-b">
        <h3 className="text-base font-semibold text-gray-900">
          Recent Announcements
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Latest updates shared with the team
        </p>
      </div>

      {/* CONTENT */}
      {announcements.length === 0 ? (
        <div className="px-5 py-6 text-sm text-gray-500">
          No announcements available.
        </div>
      ) : (
        <ul className="divide-y max-h-72 overflow-y-auto">
          {announcements.map((a) => (
            <li
              key={a._id}
              className="px-5 py-4 hover:bg-gray-50 transition flex justify-between gap-4"
            >
              {/* TEXT */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {a.title}
                </p>

                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {a.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* ADMIN ACTION */}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(a._id)}
                  className="self-start text-xs font-medium
                    text-red-600 hover:text-red-700
                    border border-red-200 hover:border-red-300
                    px-3 py-1.5 rounded-lg transition"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AnnouncementList;
