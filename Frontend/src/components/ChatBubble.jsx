import React, { useState } from "react";
import { Download, X, Smile, Frown, Heart, Trash2 } from "lucide-react";
import ImageViewer from "./ImageViewer.jsx";
import SentimentIndicator from "./SentimentIndicator.jsx";
import ReadReceipts from "./ReadReceipts.jsx";
import * as api from "../services/api.js";
import toast from "react-hot-toast";

const ChatBubble = ({ message, isOwn, senderName, senderPic, onMessageDelete }) => {
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactions, setReactions] = useState(message.reactions || []);

  const emojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "✨"];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddReaction = async (emoji) => {
    try {
      await api.addReaction(message._id, emoji);
      setReactions((prev) => {
        const existing = prev.find((r) => r.emoji === emoji);
        if (existing) {
          return prev.filter((r) => r.emoji !== emoji);
        }
        return [...prev, { emoji, userId: "currentUser" }];
      });
      setShowEmojiPicker(false);
      toast.success("Reaction added!");
    } catch (error) {
      toast.error("Failed to add reaction");
    }
  };

  const handleDeleteMessage = async () => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(message._id);
      toast.success("Message deleted");
      if (onMessageDelete) onMessageDelete(message._id);
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const groupedReactions = reactions.reduce((acc, r) => {
    const existing = acc.find((item) => item.emoji === r.emoji);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ emoji: r.emoji, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className={`flex gap-3 mb-4 group ${isOwn ? "justify-end" : "justify-start"}`}>
      {/* Avatar */}
      {!isOwn && (
        <div className="shrink-0">
          {senderPic ? (
            <img src={senderPic} alt={senderName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{senderName.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      )}

      {/* Message Container */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} relative`}>
        {!isOwn && <span className="text-xs text-gray-400 mb-1 px-2">{senderName}</span>}

        {/* Message Bubble with Actions */}
        <div className="relative">
          <div
            className={`max-w-xs rounded-lg px-4 py-2 ${
              isOwn ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-700 text-gray-100 rounded-bl-none"
            }`}
          >
            {/* Text */}
            {message.text && <p className="break-words">{message.text}</p>}

            {/* Image */}
            {message.image && (
              <div className="mt-2 cursor-pointer">
                <img
                  src={message.image}
                  alt="Message"
                  className="max-w-xs rounded-md max-h-64 object-cover hover:opacity-80 transition"
                  onClick={() => setShowImageViewer(true)}
                />
              </div>
            )}

            {/* Sentiment */}
            {message.sentiment && (
              <div className="mt-2 text-xs opacity-80">
                <SentimentIndicator sentiment={message.sentiment} score={message.sentimentScore} />
              </div>
            )}
          </div>

          {/* Action Buttons (Show on Hover) */}
          <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 transition flex gap-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="bg-gray-600 hover:bg-gray-500 text-white p-1 rounded-full text-lg"
              title="Add reaction"
            >
              😊
            </button>
            {isOwn && (
              <button
                onClick={handleDeleteMessage}
                className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute -top-12 -right-20 bg-gray-800 border border-gray-600 rounded-lg p-2 flex gap-1 z-50 flex-wrap w-40">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleAddReaction(emoji)}
                  className="text-2xl hover:bg-gray-700 p-1 rounded transition cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions Display */}
        {groupedReactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 px-2">
            {groupedReactions.map((r) => (
              <div
                key={r.emoji}
                className="bg-gray-600 rounded-full px-2 py-1 text-sm flex items-center gap-1 cursor-pointer hover:bg-gray-500 transition"
                onClick={() => handleAddReaction(r.emoji)}
                title="Click to toggle"
              >
                <span>{r.emoji}</span>
                {r.count > 1 && <span className="text-xs">{r.count}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Timestamp & Read Receipts */}
        <div className="flex items-center gap-1 mt-1 px-2">
          <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
          {isOwn && <ReadReceipts message={message} />}
        </div>
      </div>

      {/* Image Viewer */}
      {showImageViewer && (
        <ImageViewer image={message.image} onClose={() => setShowImageViewer(false)} senderName={senderName} />
      )}
    </div>
  );
};

export default ChatBubble;
