import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ UI ONLY (not sent to backend)
  const [selectedRole, setSelectedRole] = useState("admin");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://glowlogics-crm-backend.onrender.com/api/auth/login",
        {
          email,
          password, // ❌ role NOT sent
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome ${data.user.name}!`);

      // ✅ ROLE FROM DATABASE ONLY
      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "employee":
          navigate("/employee");
          break;
        case "intern":
          navigate("/intern");
          break;
        default:
          toast.error("Invalid role assigned");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: `
          linear-gradient(
            to bottom,
            #321300 0%,
            #5c2308 22%,
            #6b2a0a 38%,
            #3f1806 58%,
            #1b0c03 78%,
            #000000 100%
          )
        `,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl bg-white"
      >
        {/* LEFT PANEL */}
        <div
          className="hidden md:flex flex-col justify-center items-center bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/premium-photo/diverse-team-working-together-modern-office-space_1282444-209487.jpg?w=1400')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-800/60 to-orange-500/80" />

          <div className="relative z-10 text-center px-6">
            <h1 className="text-4xl font-extrabold text-white tracking-wide">
              Glowlogics
            </h1>
            <p className="mt-4 text-sm text-orange-100 max-w-xs">
             A modern Glowlogics Management Portal to manage attendance, performance, revenue & teams all in one place.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 text-sm">
              Login to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* LOGIN AS (UI ONLY) */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Login As
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="admin">System Manager</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full mt-2 border border-gray-300 rounded-xl px-4 py-3
                focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12
                  focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-500 hover:text-gray-800"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600
              text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Continue
            </motion.button>
          </form>

          <div className="mt-10 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Glowlogics
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
