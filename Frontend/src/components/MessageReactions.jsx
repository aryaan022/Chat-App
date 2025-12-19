import React, { useState } from "react";
import { Smile, X } from "lucide-react";

const MessageReactions = ({ message, onAddReaction, onRemoveReaction }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ["❤️", "😂", "😮", "😢", "😡", "👍", "🔥", "✨"];

  const handleEmojiClick = async (emoji) => {
    await onAddReaction(emoji);
    setShowEmojiPicker(false);
  };

  const groupedReactions = {};
  message.reactions?.forEach(reaction => {
    if (!groupedReactions[reaction.emoji]) {
      groupedReactions[reaction.emoji] = [];
    }
    groupedReactions[reaction.emoji].push(reaction.userId);
  });

  return (
    <div className="mt-1 flex flex-wrap gap-1 items-center">
      {/* Grouped Reactions */}
      {Object.entries(groupedReactions).map(([emoji, userIds]) => (
        <button
          key={emoji}
          onClick={() => handleEmojiClick(emoji)}
          className="flex items-center gap-1 px-2 py-0.5 bg-gray-700 hover:bg-gray-600 rounded-full text-xs transition group"
          title={userIds.map(uid => uid.name).join(", ")}
        >
          <span>{emoji}</span>
          <span className="text-gray-400">{userIds.length}</span>
        </button>
      ))}

      {/* Add Reaction Button */}
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1 hover:bg-gray-700 rounded transition"
          title="React"
        >
          <Smile className="w-4 h-4 text-gray-400" />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-lg z-50 grid grid-cols-4 gap-1">
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-xl p-1 hover:bg-gray-700 rounded transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;
