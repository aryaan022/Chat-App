import React from "react";
import { Check } from "lucide-react";

const ReadReceipts = ({ message, isOwn }) => {
  if (!isOwn || !message.readBy) return null;

  const readCount = message.readBy.length;
  
  if (readCount === 0) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Check className="w-3 h-3" />
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-1 text-xs text-blue-400"
      title={`Read by ${readCount} ${readCount === 1 ? "person" : "people"}`}
    >
      <Check className="w-3 h-3" />
      <Check className="w-3 h-3 -ml-2" />
      {readCount > 0 && <span>{readCount}</span>}
    </div>
  );
};

export default ReadReceipts;
