import React, { useState, useRef, useEffect } from "react";
import { User, Code, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  console.log("AUTH_USER", authUser);

  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200">
            <div className="relative">
              <img 
                src="/code.png" 
                alt="Code-Drill Logo"
                className="h-10 w-10 rounded-lg bg-blue-600/10 p-2 border border-blue-500/20" 
              />
            </div>
            <span className="text-xl font-bold text-white hidden md:block">
              Code-Drill
            </span>
          </Link>

          {/* User Profile Section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <div className="flex items-center gap-2">
                <img
                  src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-700"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white truncate max-w-32">
                    {authUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {authUser?.role?.toLowerCase() || 'Member'}
                  </p>
                </div>
              </div>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                {/* User Info Header */}
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-white truncate">
                    {authUser?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {authUser?.email || 'user@example.com'}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  {authUser?.role === "ADMIN" && (
                    <Link
                      to="/add-problem"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <Code className="w-4 h-4" />
                      Add Problem
                    </Link>
                  )}
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-700 pt-1">
                  <LogoutButton 
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </LogoutButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;