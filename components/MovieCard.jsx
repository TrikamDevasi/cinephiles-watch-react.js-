"use client";

export default function MovieCard({ movie }) {
  const img = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "/placeholder.png";

  return (
    <div
      onClick={() => (window.location.href = `/movie/${movie.id}`)}
      style={{
        width: "160px",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <img
        src={img}
        style={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          transition: "transform 0.3s ease",
        }}
        className="movie-card-img"
      />

      <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.9 }}>
        {movie.title}
      </p>

      <style jsx>{`
        .movie-card-img:hover {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}
