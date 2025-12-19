import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Loader2, Search, Plus, X } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import UserCard from "../components/UserCard.jsx";
import ChatBubble from "../components/ChatBubble.jsx";
import AISuggestions from "../components/AISuggestions.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import SearchMessages from "../components/SearchMessages.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import * as api from "../services/api.js";
import { playNotificationSound, requestNotificationPermission } from "../utils/notification.js";
import toast from "react-hot-toast";

const HomePage = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
    
    // Listen for search event from Navbar
    const handleOpenSearch = () => setShowSearchModal(true);
    window.addEventListener('openSearch', handleOpenSearch);
    
    return () => window.removeEventListener('openSearch', handleOpenSearch);
  }, []);

  // Fetch users for sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await api.getUsersForSidebar();
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await api.getMessages(selectedUser._id);
        setMessages(res.data);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log("Received message via socket:", message);
      
      // Check if message is from the currently selected user
      if (selectedUser && (message.senderId === selectedUser._id || message.senderId._id === selectedUser._id)) {
        console.log("Adding message to conversation");
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(m => m._id === message._id);
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });
        playNotificationSound();
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Listen for typing status
    const handleTypingStatus = ({ conversationId, typingUsers: users }) => {
      console.log("Typing status:", conversationId, users);
      if (selectedUser && conversationId === selectedUser._id) {
        setTypingUsers(users || []);
      }
    };

    socket.on("typing_status", handleTypingStatus);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing_status", handleTypingStatus);
    };
  }, [socket, selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    if (!messageText.trim() && !imagePreview) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsSending(true);
    try {
      const res = await api.sendMessage(selectedUser._id, messageText, imagePreview);
      
      // Add to local state immediately
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
      setImagePreview(null);

      // Emit socket event with full message details
      if (socket) {
        socket.emit("send_message", {
          _id: newMessage._id,
          senderId: user._id,
          receiverId: selectedUser._id,
          text: newMessage.text,
          image: newMessage.image,
          sentiment: newMessage.sentiment,
          sentimentScore: newMessage.sentimentScore,
          reactions: newMessage.reactions,
          readBy: newMessage.readBy,
          isDeleted: newMessage.isDeleted,
          createdAt: newMessage.createdAt,
          senderName: user.fullName,
          senderPic: user.profilePic,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle group creation
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter group name");
      return;
    }
    if (selectedGroupMembers.length === 0) {
      toast.error("Select at least one member");
      return;
    }
    
    // For now, we'll create a group UI (backend integration can be added later)
    const groupObj = {
      _id: `group-${Date.now()}`,
      fullName: groupName,
      isGroup: true,
      members: selectedGroupMembers,
      profilePic: null,
    };
    
    setUsers([groupObj, ...users]);
    setGroupName("");
    setSelectedGroupMembers([]);
    setShowGroupModal(false);
    toast.success(`Group "${groupName}" created!`);
  };

  // Handle group deletion
  const handleDeleteGroup = (groupId) => {
    setUsers(users.filter(u => u._id !== groupId));
    if (selectedUser?._id === groupId) {
      setSelectedUser(null);
    }
    toast.success("Group deleted!");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Users List */}
        <div className="w-full sm:w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Header with Search and Add Group */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 shadow-md">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowGroupModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white p-2 rounded-lg transition shadow-md hover:shadow-lg"
                title="Create group"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {users.length === 0 ? "No users available" : "No matching users"}
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredUsers.map((u) => (
                  <div key={u._id} className="relative group">
                    <UserCard
                      user={u}
                      isSelected={selectedUser?._id === u._id}
                      onClick={() => setSelectedUser(u)}
                      isOnline={onlineUsers.includes(u._id)}
                    />
                    {/* Delete group button - only show for groups */}
                    {u.isGroup && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete group "${u.fullName}"?`)) {
                            handleDeleteGroup(u._id);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                        title="Delete group"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden sm:flex flex-1 flex-col bg-gray-900">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-700 p-4 flex items-center gap-4 shadow-md">
                {selectedUser.profilePic ? (
                  <img
                    src={selectedUser.profilePic}
                    alt={selectedUser.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-400 shadow-md">
                    <span className="text-white font-bold text-lg">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-white font-bold text-lg">{selectedUser.fullName}</h2>
                  <p
                    className={`text-sm font-medium ${
                      onlineUsers.includes(selectedUser._id) || selectedUser.isGroup
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {selectedUser.isGroup
                      ? `${selectedUser.members?.length || 0} members`
                      : onlineUsers.includes(selectedUser._id)
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <ChatBubble
                      key={msg._id}
                      message={msg}
                      isOwn={msg.senderId === user._id}
                      senderName={msg.senderId === user._id ? "You" : selectedUser.fullName}
                      senderPic={msg.senderId === user._id ? user.profilePic : selectedUser.profilePic}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
                  <div className="relative w-20 h-20">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                      onClick={() => setImagePreview(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="bg-gray-800 border-t border-gray-700 p-4 space-y-2"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={isSending}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-gray-700 rounded-lg transition"
                    disabled={isSending}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={isSending || (!messageText.trim() && !imagePreview)}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p className="text-lg">Select a user to start chatting</p>
            </div>
          )}
        </div>

        {/* Mobile Chat View */}
        {selectedUser && (
          <div className="sm:hidden flex flex-1 flex-col bg-gray-900 absolute inset-0">
            {/* Chat Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3">
              <button onClick={() => setSelectedUser(null)} className="text-blue-500">
                ← Back
              </button>
              <div>
                <h2 className="text-white font-semibold">{selectedUser.fullName}</h2>
                <p
                  className={`text-sm ${
                    onlineUsers.includes(selectedUser._id) ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg._id}
                  message={msg}
                  isOwn={msg.senderId === user._id}
                  senderName={msg.senderId === user._id ? "You" : selectedUser.fullName}
                  senderPic={msg.senderId === user._id ? user.profilePic : selectedUser.profilePic}
                  onMessageDelete={(msgId) => setMessages(prev => prev.filter(m => m._id !== msgId))}
                />
              ))}
              {/* Typing Indicator */}
              {typingUsers.length > 0 && <TypingIndicator typingUsers={typingUsers} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="bg-gray-800 border-t border-gray-700 p-4">
              {/* AI Suggestions - Relative container */}
              <div className="relative mb-2">
                <AISuggestions inputValue={messageText} onSelectSuggestion={(text) => setMessageText(text)} />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    // Emit typing event
                    if (socket && selectedUser) {
                      socket.emit("typing", {
                        conversationId: selectedUser._id,
                        userId: user._id,
                        isTyping: true
                      });
                    }
                  }}
                  onBlur={() => {
                    if (socket && selectedUser) {
                      socket.emit("typing", {
                        conversationId: selectedUser._id,
                        userId: user._id,
                        isTyping: false
                      });
                    }
                  }}
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  disabled={isSending}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">Create Group</h2>
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setGroupName("");
                  setSelectedGroupMembers([]);
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Group Name Input */}
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Select Members */}
            <div className="mb-6">
              <label className="text-gray-300 text-sm mb-3 block">Select Members</label>
              <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-900 rounded-lg p-3">
                {users.filter((u) => !u.isGroup).map((u) => (
                  <label
                    key={u._id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroupMembers.includes(u._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGroupMembers([...selectedGroupMembers, u._id]);
                        } else {
                          setSelectedGroupMembers(
                            selectedGroupMembers.filter((id) => id !== u._id)
                          );
                        }
                      }}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white">{u.fullName}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowGroupModal(false);
                  setGroupName("");
                  setSelectedGroupMembers([]);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg transition font-semibold shadow-lg"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <SearchMessages onClose={() => setShowSearchModal(false)} />
      )}
    </div>
  );
};

export default HomePage;