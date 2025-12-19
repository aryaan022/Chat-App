import React from "react";
import { Circle, Users } from "lucide-react";

const UserCard = ({ user, isSelected, onClick, isOnline }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-lg transition border-l-4 flex items-center gap-3 ${
        isSelected
          ? "bg-gray-700 border-l-blue-500 border-gray-600"
          : "hover:bg-gray-800 border-l-transparent border-gray-700"
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            {user.isGroup ? (
              <Users className="w-6 h-6 text-white" />
            ) : (
              <span className="text-white font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        )}
        {/* Online Indicator - Only for non-groups */}
        {!user.isGroup && isOnline && (
          <Circle className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full fill-green-500 border-2 border-gray-800" />
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 text-left">
        <p className="text-white font-medium truncate">{user.fullName}</p>
        {user.isGroup ? (
          <p className="text-sm text-gray-400">{user.members?.length || 0} members</p>
        ) : (
          <p className={`text-sm truncate ${isOnline ? "text-green-400" : "text-gray-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>
    </button>
  );
};

export default UserCard;
