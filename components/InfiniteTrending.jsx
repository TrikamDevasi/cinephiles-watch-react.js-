"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function InfiniteTrending() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/tmdb/trending");
        const data = await res.json();
        setMovies(data?.data?.results || []);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    }

    fetchTrending();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Trending Movies</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
