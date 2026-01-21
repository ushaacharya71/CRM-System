import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/announcements");

        // ✅ NORMALIZE RESPONSE (ALWAYS ARRAY)
        const normalized =
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data?.announcements)
            ? res.data.announcements
            : [];

        setAnnouncements(normalized);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);

  // ✅ FINAL SAFETY
  const safeAnnouncements = Array.isArray(announcements)
    ? announcements
    : [];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-8">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Announcements
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Company-wide updates and official notices
          </p>
        </div>
      </div>

      {safeAnnouncements.length === 0 ? (
        <div
          className="flex items-center justify-center text-sm text-gray-500
          bg-gray-50 border border-dashed rounded-xl p-6"
        >
          No announcements have been published yet.
        </div>
      ) : (
        <div className="space-y-5">
          {safeAnnouncements.map((a) => (
            <article
              key={a._id}
              className="rounded-xl border border-gray-200 bg-white
              hover:shadow-md transition-shadow"
            >
              {/* META BAR */}
              <div
                className="flex items-center justify-between px-5 py-3
                border-b bg-gray-50 rounded-t-xl"
              >
                <span className="text-xs font-medium text-gray-500">
                  {a.createdAt
                    ? new Date(a.createdAt).toLocaleDateString()
                    : "—"}
                </span>

                <span
                  className="px-3 py-1 rounded-full text-xs font-medium
                  bg-blue-50 text-blue-700 capitalize"
                >
                  {a.type ? a.type.replace("-", " ") : "general"}
                </span>
              </div>

              {/* CONTENT */}
              <div className="px-5 py-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  {a.title || "Untitled announcement"}
                </h4>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {a.message || "—"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Announcements;
