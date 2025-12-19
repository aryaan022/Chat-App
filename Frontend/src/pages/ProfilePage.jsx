import React, { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, updateProfilePic } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUpdating(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const success = await updateProfilePic(reader.result);
        if (success) {
          toast.success("Profile picture updated!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />

      <div className="flex-1 overflow-y-auto flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">My Profile</h1>

          {/* Profile Picture */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center border-4 border-blue-500">
                  <span className="text-4xl text-white font-bold">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdating}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {user?.fullName}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white break-all">
                {user?.email}
              </div>
            </div>

            {/* Joined Date */}
            {user?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Joined</label>
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 Click the camera icon to change your profile picture. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;