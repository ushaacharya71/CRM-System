import React, { useEffect, useState } from "react";
import api from "../api/axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get("/announcements");
        setAnnouncements(res.data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    fetchAnnouncements();
  }, []);

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

      {announcements.length === 0 ? (
        <div className="flex items-center justify-center text-sm text-gray-500
          bg-gray-50 border border-dashed rounded-xl p-6">
          No announcements have been published yet.
        </div>
      ) : (
        <div className="space-y-5">
          {announcements.map((a) => (
            <article
              key={a._id}
              className="rounded-xl border border-gray-200 bg-white
              hover:shadow-md transition-shadow"
            >
              {/* META BAR */}
              <div className="flex items-center justify-between px-5 py-3
                border-b bg-gray-50 rounded-t-xl"
              >
                <span className="text-xs font-medium text-gray-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>

                <span className="px-3 py-1 rounded-full text-xs font-medium
                  bg-blue-50 text-blue-700 capitalize">
                  {a.type.replace("-", " ")}
                </span>
              </div>

              {/* CONTENT */}
              <div className="px-5 py-4">
                <h4 className="text-base font-semibold text-gray-900 mb-1">
                  {a.title}
                </h4>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {a.message}
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
