import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
  "https://glowlogics-crm-backend.onrender.com/api/auth/login",
  { email, password }
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at top, #FFEDD5 0%, #FB923C 35%, #F97316 65%, #9A3412 100%)",
      }}
    >
      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white"
      >
        {/* LEFT BRAND PANEL */}
        <div
          className="hidden md:flex flex-col justify-center items-center bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/diverse-team-working-together-modern-office-space_1282444-209487.jpg?w=1400')",
          }}
        >
          {/* ORANGE OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-800/60 to-orange-500/80" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 text-center px-6"
          >
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Glowlogics
            </h1>
            <p className="mt-4 text-sm text-orange-100 max-w-xs leading-relaxed">
              A modern CRM to manage attendance, performance, revenue & teams —
              all in one place.
            </p>
          </motion.div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back 👋
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Login to access your dashboard
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {[
              {
                label: "Login As",
                element: (
                  <select
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3
                    focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                    <option value="intern">Intern</option>
                  </select>
                ),
              },
              {
                label: "Email",
                element: (
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3
                    focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                ),
              },
              {
                label: "Password",
                element: (
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3
                    focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                ),
              },
            ].map((field, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {field.label}
                </label>
                {field.element}
              </motion.div>
            ))}

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600
              text-white py-3 rounded-xl font-semibold
              shadow-lg hover:shadow-orange-500/40 transition-all duration-200"
            >
              Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
            </motion.button>
          </motion.form>

          {/* FOOTER */}
          <div className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Glowlogics — All rights reserved
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
