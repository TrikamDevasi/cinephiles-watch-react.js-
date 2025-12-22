"use client";
import { useState } from "react";

export default function AiRecommendations({ isOpen, onClose }) {
  const [mood, setMood] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAIRecommendations = async () => {
    if (!mood.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      const data = await response.json();
      setMovies(data.recommendations);
    } catch (error) {
      console.error("OpenAI Error:", error);
      setMovies([{ title: "Try again!", overview: "Something went wrong" }]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-black/95 border border-gray-700 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎬 AI Movie Magic
          </h3>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="I'm feeling adventurous, romantic, scary..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && getAIRecommendations()}
          />
          
          <button
            onClick={getAIRecommendations}
            disabled={loading || !mood.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "🤖 AI Thinking..." : "✨ Get Movie Magic"}
          </button>
        </div>

        {movies.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold text-purple-400">Your AI Picks:</h4>
            {movies.map((movie, index) => (
              <div key={index} className="p-5 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all">
                <h5 className="font-bold text-white text-lg mb-2">{movie.title}</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{movie.overview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
