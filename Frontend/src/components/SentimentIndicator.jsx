import React from "react";
import { Heart, Smile, Frown } from "lucide-react";

const SentimentIndicator = ({ sentiment, score }) => {
  const getSentimentIcon = () => {
    if (sentiment === "positive") {
      return <Smile className="w-4 h-4 text-green-400" />;
    } else if (sentiment === "negative") {
      return <Frown className="w-4 h-4 text-red-400" />;
    }
    return <Heart className="w-4 h-4 text-gray-400" />;
  };

  const getSentimentColor = () => {
    if (sentiment === "positive") return "text-green-400";
    if (sentiment === "negative") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className={`flex items-center gap-1 text-xs ${getSentimentColor()}`} title={`Sentiment: ${sentiment} (Score: ${score.toFixed(2)})`}>
      {getSentimentIcon()}
      <span className="capitalize">{sentiment}</span>
    </div>
  );
};

export default SentimentIndicator;
