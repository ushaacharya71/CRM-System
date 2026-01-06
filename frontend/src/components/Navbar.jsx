import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ user, onMenuClick }) => {
  return (
    <div className="flex items-center justify-between bg-white shadow-md px-4 md:px-6 py-4 rounded-xl mb-6">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-700 hover:text-orange-600"
        >
          <Menu size={26} />
        </button>

        <h1 className="text-lg md:text-2xl font-bold text-gray-700">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* Right section */}
      <p className="text-xs md:text-sm text-gray-500">
        {new Date().toDateString()}
      </p>
    </div>
  );
};

export default Navbar;
