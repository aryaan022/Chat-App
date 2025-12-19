import React, { useState, useEffect } from "react";
import { Moon, Sun, Bell, BellOff } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedNotifications = localStorage.getItem("notifications");
    const savedSound = localStorage.getItem("sound");

    if (savedTheme === "light") setIsDarkMode(false);
    if (savedNotifications === "false") setNotificationsEnabled(false);
    if (savedSound === "false") setSoundEnabled(false);
  }, []);

  // Save theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
    toast.success(`Switched to ${!isDarkMode ? "dark" : "light"} mode`);
  };

  // Save notifications
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    localStorage.setItem("notifications", String(!notificationsEnabled));
    toast.success(`Notifications ${!notificationsEnabled ? "enabled" : "disabled"}`);
  };

  // Save sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem("sound", String(!soundEnabled));
    toast.success(`Sound ${!soundEnabled ? "enabled" : "disabled"}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 overflow-y-auto flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Settings Title */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Customize your chat experience</p>
          </div>

          {/* Theme Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-6 w-6 text-blue-500" />
                ) : (
                  <Sun className="h-6 w-6 text-yellow-500" />
                )}
                <div>
                  <h3 className="text-white font-semibold">Theme</h3>
                  <p className="text-sm text-gray-400">
                    {isDarkMode ? "Dark mode" : "Light mode"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? "bg-blue-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {notificationsEnabled ? (
                  <Bell className="h-6 w-6 text-green-500" />
                ) : (
                  <BellOff className="h-6 w-6 text-gray-500" />
                )}
                <div>
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-400">
                    {notificationsEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notificationsEnabled ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sound Settings */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔊</span>
                <div>
                  <h3 className="text-white font-semibold">Message Sounds</h3>
                  <p className="text-sm text-gray-400">
                    {soundEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  soundEnabled ? "bg-purple-600" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-3">About</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <p className="font-medium text-gray-300">ChatApp v1.0</p>
                <p>Real-time messaging application</p>
              </div>
              <div className="pt-2">
                <p className="font-medium text-gray-300">Built with:</p>
                <p>React, Node.js, MongoDB, Socket.IO</p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-300">
              ℹ️ Your settings are saved automatically in your browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;