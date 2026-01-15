import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import AttendancePanel from "../components/AttendancePanel";
import AttendanceSummary from "../components/AttendanceSummary";
import ManagerLeaveApproval from "../components/ManagerLeaveApproval";
import LeaveSummary from "./LeaveSummary";
import ApplyLeave from "./ApplyLeave";
import MyLeave from "./MyLeave";
import api from "../api/axios";
import TopPerformers from "../components/TopPerformers";
import BirthdayBanner from "../components/BirthdayBanner";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const role = loggedInUser?.role;

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* ================= FETCH ASSIGNED USERS ================= */
  const fetchAssignedUsers = async () => {
    try {
      const res = await api.get("/users/manager/interns");
      setAssignedUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching assigned users:", error);
    }
  };

  /* ================= FETCH ANNOUNCEMENTS ================= */
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
  };

  useEffect(() => {
    fetchAssignedUsers();
    fetchAnnouncements();
  }, []);

  if (!loggedInUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }
return (
  <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-gray-100">
    {/* SIDEBAR */}
    <Sidebar
      onLogout={handleLogout}
      isOpen={sidebarOpen}
      setIsOpen={setSidebarOpen}
    />

    {/* MAIN */}
    <div className="flex-1 md:ml-64 px-4 sm:px-6 py-6">
      {/* NAVBAR */}
      <Navbar
        user={loggedInUser}
        onMenuClick={() => setSidebarOpen(true)}
      />

      {/* ================= HERO ================= */}
      <section className="relative mt-6 overflow-hidden rounded-[28px]
        bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400
        text-white p-6 sm:p-8 shadow-2xl">

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {loggedInUser?.name}
            </h1>
            <p className="text-sm text-white/85 mt-2 max-w-xl">
              Command your team, track performance, and make smarter decisions.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/manager/stipend")}
                className="bg-white text-orange-600
                px-5 py-2.5 rounded-xl text-sm font-semibold
                hover:bg-orange-50 transition shadow-md"
              >
                Manage Stipends
              </button>

              <button
                onClick={() => navigate("/manager/revenue")}
                className="bg-black/20 hover:bg-black/30
                px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Update Revenue
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX///8AAADj4+PIyMhDQ0Pt7e34+Pjz8/OQkJD7+/tCQkLb29u4uLgiIiJkZGT8/PzR0dETExOmpqZKSkpYWFjp6elzc3O/v7+ysrImJiZ9fX3f39+cnJzOzs6EhIQ0NDQtLS1nZ2cMDAyAgIChoaE4ODh3d3ccHByLi4tUVFSUlJQYGBhgHYQlAAAPLElEQVR4nNVdaYPqrA7W1rZqtdbauu9nnHF8////u+MMAboDCdr7fDzHKQSyEZLQ69nGKDtMksc2Wpym82v/iet8elpE20cyOWS+9fEtYuTFyTHa9JuxiY5J7M3ePVltBHGyHLfQJmO8TMLg3ZNWhh/v06kGdYBp+oj/D5jWW0cm1HEqo7X3bhKa4CUDBHWAQdJRIoNkoTD96/Wq8KvFunNC6bvL2uluxunysV4d4nDnZJnnZc4ujN3V+rFMx/Wadul2SSaz/a2atnSbxE7TdgROvN6m1XTe9tnLKGhG+FnJaMdJpspqgTM5VrL4Z2h15mo4pOWJne+uvhwF7v1c/lR6sDBnHbhls54i9P2PrSl9b+ASzlcXhyJrzaMVVgn6q2heZPh37WNcXG/M7snw1kXOj2KSD+shK+iXzXBH+HXnUdCvS4fw6yqY7fMT+J5QWy9/UhCBx0vPH25e61liooIYnF+ncoJLbuRPewzk5D2ly4sc1smr6HvCyYv7xOpgf/ByG7i073TscvtofxtX8ulv8RolHss6Z7qyO9g/aaz5K1jmDxPZCfhncaDsJA10fOXpxj9KI5+snTlW0ijjV3v9oewB2+HU2VAaYm9liGbITsbQgvkPJPO7eM+xLZQ0TkQe5nCkU/xwRP11RYwkNroR2+FQ4pB3nkkP0jxITZWkY9L3RsEC6WBFaK0SiUPpvmoIiVMTqm/urSybMSS/mEili0WbdiH09aMUhOdIwlJ3/rlBV6Ltnrg8uOO/JgiM3mUkyhhFdCQKFrXp8OpjS8Woe6oPkUMsPUrdJDSf4Qgyx3GUg/3NEIuPMBpCL3+gJ5S593R8fp7z5udxOnTxJ6APPjvjo0ZIRqCzL0f/x3usZylINHTgHCoWdeuuThfI+KBgVKPFCvhpAqdkVtV3i3+44c6yXN3cDGR7xk0OykyE3w30PfGN8pN43OiifyTmyxNhZrCvJisHlAzwfdBmNH5eWiA8Ga/i9rQCKcIb9LkDp8nvGfzdFDF6mL8/Sj/czJ/NZr7jfuRJ3yA41eNuuJ794TcviLHl83j/Ulxi9yL/NyJuwG3aWeevuNeHOA/GEgHHKm2eyTFQREiC+yVb9b/hQoiwE1Jk51J3d+pI+4hgFq4UlUWRs3ZqPmombhib+ED4hWeEGwdSraw0+Mqau8gzrkpOze6Gw1ciNQ/yBpxb1H7P1xUh/twODtpuN4S6R9hFrtSU9AZfEAohXLRvzIx7rRSiqMKnF/XJ1QImPVbh8wDOHQvzAUcwogKfugQrCrp4rpaAsoPbQYQbzrmm9bgyA8nHeIvgy6haU5D8DWJMkPxzG+vBD8eIwWALFTVbT0gG5iwFvN6yNdwfxZxpQDuqWzgYdoAYlfNp87CQ23EkGEonknknWFhwApdNPwJfco65owfNreMvgInChBN8UFhNPi6cJ1EXMGOFpSxhiRd/rrAazuzgGmBMIQ9g6XlEMDQm/sZ9h/qh4Reo21W2kle92MDoSsA9IGS1rgMYez3+KuKf2UcYm+JuRy6MgjqzDxYFd0vIThW6oXZ2gYA4sPWEGq+xOiAKn6hB/JsZpzMOu+EyrcDaVUsiHOlwwfaACZTugdZj4ou7hQU1V8kKsMM4KeQz1T09w8og75khVbNK0mCDkfclzAHb6HJbcDbb+wJgEytEDVxDdXe5cYiTLoX+iWSBudNSXik4VGAzjRiFZ20KafaQC1vpiAEq8Bs5APDCXFsO5zQUgttSUspg7dEpQUzTaGsMGl3aE95p0eovDRVECSBPum5DaCi/5QlsKm0CnF4e2O+/16f5xYPRkpeTNftXgtqlba26bgQzVhp3D3XY9avWeEG2grBYU80/YzcJa4IZMC7KnTBAPVB8H5ZQz+zAwYeiAA4YUlZaTAjmFKl5M2Z39M5BjLdvFBnq3rzMpiw6hrqy54CIkI5W9NnfYCJgAsyvkc5QwKQ0ZQzAcDoxZSqP6g8QsBUsCYxLlMI9Lg3QBlhiVCBKAGyfUCsRJZOKBVPX/NvSlHBICwT5hJr6FxC4VE3qApdxTjUBsFigCkBwyJKcYRM3al/04CaHbImB60GsmZifqL7f60Eqm1LglYc5b3QTOOeVHeNagqRwAM80URFtnrhFWIzDbhaYjxZM9aRGBTz/vTWjbnaBnxKuMEj29M86wIJTlvsEPP/gu1kWPZ67uCAdPyeIzGVD3KJXwOGthDZNvOHy1LcrbS0ak+0/x40dfmkcJg4pq+1fnf/mS2XFxBVxzHX8PQaPmAtCXdIk19R+VNHof0i/oK57ZbGMwfN+CFiWvHOATGL/HubvokbhvW+RQB43fWoBpmg29HWFbq7RzG07Cb1g1psFWTjZ5pK/5/RFm8FGqBq6AEkJTrEGYX4aD8anYoedAWXfF4AULmIySRAgKSNXRl8HO4X9zJl/GtlIEGsBcWvvS0udJxhrPp0qiWHtDNXUR3FqaWGFevlRamwse01Y/KSuz+c4sdd5ApTpiN+GEatST455z+LtqUTeaXuQfdaQuEAVlGkGvgdR/IDB338VBNvfJZ+i/Gnwmezy25f0v/a0G8oY5wDGn9RYrL9+hbzEFn6Q7cJdFpQSUf5aUnyRnYCfYOZiAjoHebctY8fPFaozXvO9JbSMzN1O4B6DrAjWh4uR3xm77XlDI1du6/ogY1V2CH6AZaRikDDfhVahrVO+8RRd4xvGnFsw+ESu71qe7PlD7UI32+favxEtNnP8Izgq0oQwttJE52t1hvPXsq9K40CyQMaixwwVhUsTyNWUmgLly5WKJAEN5tSc4N6OgPsdyQU1aKsmy+OGwMNi1+ZTiE/j1XQoGM2wp5rUC26OX3F2jznvsYgRetHkWjVTB0zeRjSJzDG99tgH0Yk6YgcxxfsidIPeRUjyIqLQEQyG08q8ZKc/xSbYXXMUIhN1ghPVvKS1OuE0qkdJ4YybCZPK/wJEp4Nv1KV+YQ9xXMoDuwMKQyZuBFBJ31wOCXQpd9XGRL2geUwA48BxXYq3h7xDCKaUNweP+6mIhef2EO/TcKaiO9xB1hGm1Iv7NGi/lJ8HKe8fudEwTyXkfin2bMF9GdqGn9wRN2YuFoBaoM+HUMNAfSuA/i4/HyLP+Lzkl7pbHSSnGd/6MQ2/BTEy5HdeNkzfUBGymVsLe2vACcPF2qDdGbaGoQqQo2EY+OexNly8FPSBjTsBbmfN/pzHS5lSNYt5wxbaacgH5bZmm8hj3qh7Cxa3+LLTlzb4YnMz+mN+b4G5ewJFaqv3NRhFE1Mm7p4w94ep+IoVwOqbKAlxfwgqy8AggjtDUKRRA/AIDTxe6Q7Y/B4fxrfXmtYzX0PmyTzzoIxzMWbsUGHDFgIuf0MM9K2+lIthnE8DTGrz+Rc4Y2j733I+DXCCtjJlmm5q8xUISNDW1tZyTtTMNK8tMhZgDWwNZYi5auNfNW+Ymwj5cHbfKAI21ZUhOTfRNL+UnTDJj015wCFKN/Mtl19qmCO8N9XBekiN7EU+R9gwz5spcttdsIdGJimf522Yq28h/70KbK5fen91zzMY47ez1jeg2sz2m3ag9vVs0jnP20Y1M8zea9fd6wLq9LVsfrFmxqjuaWKmgfXBtKKWuS7WPYHt1lKLiZEGMMBF1vuKKNauGdUfDo3UkwHu+jq7XH9oUkP6abC0RmDMolP9Xq4hNakDjgzEwwgT47nJ1zoGtdzf+ttuBrYhGi1Jqmq5Derx2bbbfxvULW9IC6rq8Q16KnSYwqqeCjy0q+6hdJfC6r4Y+r1NukthTWdK7f40naWwpj+Nfo+hzlJY12NIu09UZyms6xOl3ZmiqxTWd+WAJClV36GrFF7+fn6tyO3R7LnXUQobeu7p9k3sKIVNfRM1e192k0Kw9tXOmV7/0m5S2Ny/lCeoKYVEOkkhSFpdVoJWH+FOUsgUaf2sdHpBd5HC1l7Qop+3wte6SGF7P2+dnuwdpFChJ7tOX/3uUajUV1/jbYTuUaj0NoLIJWu1GJ2jUPF9C/U3SjpHoeIbJervzHSNQuV3ZpTfCuoYhepvBUnvPTVnq3WLwpnGe088OtwSd+sWhbwkQulySe3dtU5RqPfumuLbeV2iUPftPLX3D7tEofb7h0pvWHaIQv03LJXeITVsTK6P1uxQk3dIez1e9VprFdnlM75LfAugi32tp8wtoV530vb3gGHlxvGoN7OF3igGZ6yOm0zfAxaiWPfMJmQMvQp10+CNi7Rvo1vf5X5Uz8QS6twP83e5299WD8rNreyhrnKdq8TIoP5LVI3XrF9YPRkrqFF4nNHMquT5abjuJBVXTsYGauISouOLYf6g2KSaVhfB5SX0XWo2SDTRMC6lFR1I67p5hP/G/1ml7r/xsW76gkBE2lLCP1J/5Pccm6j3NAWLovwq8Rnb2c66GCosvuaHcC8TUmNLt/Si3W9k2wVVh8+NNUX6pyBxYLe0Qh3egJJAmVGnVP3wcAhFQyMi7SC1UrOfTtqOiZgOWXmuMBodUKmCpSiP39KypXbqtlUh9/UjZSjZBaVvL64OqVs/RZtAGY7URH1oq3a7DSOJQ2/kxTqBMEH9xXt0aigaEVe08MVjJi2gtR4DTZC7Yw4pXi8rQ37sgKxVrCpCuSm4tQqBTO4Va6cdfg1GcoP+E1VPsSpIj4r0568z/xO5Ra3lI8BK7pL/ba0Zfw6x3NvWsDeqBvKtm5c2nqbII1zKAxr3RtXBRB6x/2m3iNT5zI32IsEoBKCW9mh0cvv3mg38g5trwN2P7MhjHOVGOdu/yZMwK8T0FxNqH8OfLPJDPF7tK2Z5BupvHpRKZ/covN6ytGkD61Bgop+D1Zqof+k6LXzZkhi041BgpP48WmG51V9FxdeSFgc7XqgS3PITMpidLO/e8wUJwvma4FCeU/98d/W3MnDv5/Kn0neetwHhZ3liP6x1nDiqZAbO5Fhk+Ceun90I7j0fqLhVzO9Hv6bbJG6kM3DiZJtWv3p1279Df9bBd5eVs/ylc5wuh8nKjcOdk2Veljm7MD6s1sNlOq5/0WvpdifEzhAkVYxW5rxr+2/6i+S9Eb1aeMmgffatGCRduT2ohLe+NL2z1oZpROQ1WIUf71MTKqfpPu6c7NUiiJNl3XtyVRgvk7CjoteAkRcnx6jCiuewiY5J7L0rxkyCUXaYJI9ttDhN53969DqfnhbR9pFMDpl90v4Hk7mz1yXvOF0AAAAASUVORK5CYII="
              alt="Manager Avatar"
              className="w-12 h-12 rounded-full
              border-4 border-white/40 shadow-xl object-cover"
            />
            <div className="text-sm">
              <p className="font-semibold">{loggedInUser?.email}</p>
              <p className="text-white/80">
                {loggedInUser?.teamName || "No team assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* ORANGE GLOW */}
        <div className="absolute -top-24 -right-24 w-80 h-80
          bg-white/20 rounded-full blur-3xl" />
      </section>

      {/* ================= ATTENDANCE ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
        <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
          <AttendancePanel />
        </div>
        <div className="rounded-2xl bg-white/80 backdrop-blur border shadow-sm">
          <AttendanceSummary />
        </div>
      </section>

      <BirthdayBanner />

      {/* ================= LEAVE ================= */}
      {role === "manager" && (
        <section className="mt-10 rounded-3xl bg-white border shadow-sm p-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-4">
            Leave Management
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LeaveSummary />
            <ApplyLeave />
            <MyLeave />
          </div>
        </section>
      )}

      {/* ================= PERFORMANCE ================= */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Performance Intelligence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TopPerformers type="daily" title="Daily Leaders" />
          <TopPerformers type="weekly" title="Weekly Momentum" />
          <TopPerformers type="monthly" title="Monthly Champions" />
        </div>
      </section>

      {/* ================= APPROVAL ================= */}
      <section className="mt-12">
        <ManagerLeaveApproval />
      </section>

      {/* ================= TEAM ================= */}
      <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Assigned Team Members
        </h2>

        {assignedUsers.length === 0 ? (
          <p className="text-sm text-gray-500">
            No users assigned to you.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Team</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-orange-50 transition"
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3">{u.teamName || "-"}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          navigate(`/manager/view-dashboard/${u._id}`)
                        }
                        className="text-orange-600 hover:text-orange-700 font-semibold"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ================= ANNOUNCEMENTS ================= */}
      <section className="mt-12 rounded-3xl bg-white border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-orange-600 mb-4">
          Company Announcements
        </h2>

        {announcements.length === 0 ? (
          <p className="text-sm text-gray-500">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a._id}
                className="rounded-2xl bg-gradient-to-r
                from-orange-50 to-white border p-4"
              >
                <p className="font-semibold text-gray-900">{a.title}</p>
                <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);

};

export default ManagerDashboard;
