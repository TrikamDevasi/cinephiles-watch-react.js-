"use client";

import MovieCard from "./MovieCard";

export default function Row({ title, movies = [] }) {
  return (
    <div style={{ padding: "30px 40px" }}>
      <h2 style={{ marginBottom: "15px", fontSize: "1.8rem" }}>{title}</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{ flexShrink: 0 }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
