"use client";

import { useState } from "react";
import MovieCard from "@/components/MovieCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Search Movies</h1>

      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded bg-zinc-900 border border-zinc-700 focus:outline-none"
        />
      </form>

      {loading && <p className="text-center">Searching…</p>}
      {error && <p className="text-center text-red-400">{error}</p>}

      {!loading && results.length === 0 && query && (
        <p className="text-center text-zinc-400">No results found</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
