import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome ${data.user.name}!`);

      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "manager") navigate("/manager");
      else if (data.user.role === "employee") navigate("/employee");
      else navigate("/intern");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-orange-600 px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* LEFT GLASS IMAGE PANEL */}
        <div
          className="hidden md:flex flex-col justify-center items-center bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl"></div>

          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold tracking-wide text-gray-900">
              Glowlogics
            </div>
            <p className="mt-3 text-gray-700 text-sm max-w-xs">
              Empowering teams through smart CRM & performance tracking.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Login to manage your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* ROLE */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Login As
              </label>
              <select
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option> {/* ✅ ADD THIS */}
                <option value="employee">Employee</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 mt-2 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
            >
              Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Glowlogics — All rights reserved
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
