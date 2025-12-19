import React, { useState } from "react";
import { Search as SearchIcon, Filter, X } from "lucide-react";

const SearchMessages = ({ onSearch, onClose }) => {
  const [query, setQuery] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (sentiment) params.append("sentiment", sentiment);

      const response = await fetch(`/api/messages/search/messages?${params}`);
      const data = await response.json();
      setResults(data.messages || []);
    } catch (error) {
      console.log("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold">Search Messages</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Search Text</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Filter by Sentiment</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSentiment("")}
                className={`px-4 py-2 rounded-lg transition ${
                  sentiment === ""
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSentiment("positive")}
                className={`px-4 py-2 rounded-lg transition ${
                  sentiment === "positive"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Positive 😊
              </button>
              <button
                onClick={() => setSentiment("neutral")}
                className={`px-4 py-2 rounded-lg transition ${
                  sentiment === "neutral"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Neutral 😐
              </button>
              <button
                onClick={() => setSentiment("negative")}
                className={`px-4 py-2 rounded-lg transition ${
                  sentiment === "negative"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Negative 😢
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center text-gray-400">Searching...</div>
        ) : results.length === 0 ? (
          <div className="text-center text-gray-400">No messages found</div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-400 mb-4">
              Found {results.length} message{results.length !== 1 ? "s" : ""}
            </div>
            {results.map((msg) => (
              <div key={msg._id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm">{msg.text}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      <span className="capitalize">• {msg.sentiment}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMessages;
