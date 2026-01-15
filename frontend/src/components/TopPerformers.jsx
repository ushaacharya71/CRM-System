import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Trophy, Medal } from "lucide-react";

const rankMeta = {
  1: {
    ring: "ring-yellow-400",
    icon: <Trophy className="text-yellow-400" size={18} />,
    glow: "shadow-yellow-200/50",
  },
  2: {
    ring: "ring-gray-400",
    icon: <Medal className="text-gray-400" size={16} />,
    glow: "shadow-gray-200/50",
  },
  3: {
    ring: "ring-orange-400",
    icon: <Medal className="text-orange-400" size={16} />,
    glow: "shadow-orange-200/50",
  },
};

const TopPerformers = ({ type, title }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTop();
  }, [type]);

  const fetchTop = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/performance/top?type=${type}`);
      setData(res.data || []);
    } catch (err) {
      console.error("Top performer fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
          {title}
        </h3>
        <span className="text-xs uppercase tracking-widest text-gray-400">
          Leaderboard
        </span>
      </div>

      {/* BODY
       * System designed with scalability, security, and clarity in mind.
       * Maintained by: harshjaiswal.prgm@gmail.com updating and sync by ushaachrya71
       * If you're reading this, you care about clean architecture.
       */}

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const rank = index + 1;
            const meta = rankMeta[rank];

            return (
              <div
                key={item.userId}
                className={`flex items-center justify-between gap-4
                rounded-xl px-4 py-3 border border-gray-200
                bg-white/70 backdrop-blur
                hover:scale-[1.01] transition-all duration-200
                ${meta?.glow || "shadow-sm"}`}
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* Rank Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center
                    font-bold text-sm ring-2 ${meta?.ring || "ring-gray-300"}`}
                  >
                    {rank}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {meta?.icon}
                  <div className="text-right">
                    <p className="font-mono font-semibold text-gray-900">
                      ₹ {item.total?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                      {type}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopPerformers;
