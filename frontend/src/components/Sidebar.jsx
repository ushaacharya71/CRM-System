import React from "react";
 import { motion } from "framer-motion";

//  for now i am not using animation later I will add

 import { BarChart3, Users, Megaphone, LogOut } from "lucide-react";

const Sidebar = ({ onLogout }) => {
  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-64 h-screen bg-gradient-to-b from-orange-500 to-blue-900 text-white flex flex-col p-5 fixed"
    >
      <h2 className="text-2xl font-bold mb-10 text-center">Glow CRM</h2>
      <nav className="flex flex-col gap-6 text-lg">
        <button className="flex items-center gap-3 hover:text-orange-300">
          <Users size={20} /> Employees
        </button>
        <button className="flex items-center gap-3 hover:text-orange-300">
          <Users size={20} /> Interns
        </button>
        <button className="flex items-center gap-3 hover:text-orange-300">
          <BarChart3 size={20} /> Revenue
        </button>
        <button className="flex items-center gap-3 hover:text-orange-300">
          <Megaphone size={20} /> Announcements
        </button>
      </nav>
      <div className="mt-auto pt-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-red-300 hover:text-red-400"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
