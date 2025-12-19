import React from "react";
import { X, Download } from "lucide-react";

const ImageViewer = ({ image, onClose, senderName }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = `message-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl max-h-screen">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image */}
        <img
          src={image}
          alt="Full view"
          className="max-w-full max-h-screen rounded-lg object-contain"
        />

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition shadow-lg flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Sender Info */}
        <div className="absolute bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          From: {senderName}
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
