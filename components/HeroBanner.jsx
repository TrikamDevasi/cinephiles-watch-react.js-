"use client";

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div
      style={{
        height: "80vh",
        backgroundImage: `url(${backdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: "40px",
      }}
    >
      {/* Dark fade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9))",
        }}
      />

      <div style={{ position: "relative", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold" }}>
          {movie.title}
        </h1>

        <p style={{ marginTop: "10px", opacity: 0.9 }}>
          {movie.overview?.slice(0, 150)}...
        </p>

        <button
          onClick={() => (window.location.href = `/movie/${movie.id}`)}
          style={{
            marginTop: "20px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ▶ Watch Now
        </button>
      </div>
    </div>
  );
}
