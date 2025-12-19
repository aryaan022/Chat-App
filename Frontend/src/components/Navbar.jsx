import React, { useState } from "react";
import { MessageCircle, LogOut, Settings, User, Menu, X, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline">
            ChatApp
          </span>
        </Link>

        {/* Desktop User Menu */}
        {user && (
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate("/profile")}
                  title="View profile"
                />
              ) : (
                <div 
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-400 shadow-md cursor-pointer hover:shadow-lg transition"
                  onClick={() => navigate("/profile")}
                  title="View profile"
                >
                  <span className="text-white text-sm font-bold">
                    {user.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-white font-semibold max-w-xs truncate">{user.fullName}</span>
            </div>

            <div className="flex items-center gap-1 ml-2 pl-4 border-l border-gray-700">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openSearch'))}
                className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-700 rounded-lg transition"
                title="Search messages"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/profile"
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                to="/settings"
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        {user && (
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {user && showMobileMenu && (
        <div className="sm:hidden bg-gray-800 border-t border-gray-700 p-4 space-y-3">
          {/* User Info in Mobile Menu */}
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-700 rounded-lg">
            {user.profilePic ? (
              <img
                src={user.profilePic}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-400">
                <span className="text-white font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-white font-semibold">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          </div>

          {/* Mobile Menu Items */}
          <Link
            to="/profile"
            onClick={() => setShowMobileMenu(false)}
            className="w-full flex items-center gap-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setShowMobileMenu(false)}
            className="w-full flex items-center gap-3 text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setShowMobileMenu(false);
            }}
            className="w-full flex items-center gap-3 text-gray-300 hover:text-red-400 px-4 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
