import React, { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import * as api from "../services/api.js";

const AISuggestions = ({ inputValue, onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    console.log("AISuggestions - inputValue:", inputValue, "length:", inputValue?.trim().length);
    if (inputValue && inputValue.trim().length > 2) {
      fetchSuggestions(inputValue);
      setShow(true);
    } else {
      setSuggestions([]);
      setShow(false);
    }
  }, [inputValue]);

  const fetchSuggestions = async (context) => {
    try {
      setLoading(true);
      console.log("Fetching suggestions for:", context);
      const response = await api.getAISuggestions(context);
      console.log("Response from API:", response);
      setSuggestions(response.data.suggestions || []);
    } catch (error) {
      console.log("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!show || !suggestions.length) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 w-full bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50">
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-yellow-400 border-b border-gray-600 bg-gray-800 sticky top-0">
        <Lightbulb className="w-4 h-4" />
        <span>💡 AI Suggestions</span>
      </div>
      {loading ? (
        <div className="px-4 py-2 text-gray-400 text-sm">Loading...</div>
      ) : (
        suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => {
              onSelectSuggestion(suggestion);
              setSuggestions([]);
              setShow(false);
            }}
            className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 transition text-sm border-b border-gray-600 last:border-b-0"
          >
            {suggestion}
          </button>
        ))
      )}
    </div>
  );
};

export default AISuggestions;
