"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner({ movie }) {
  if (!movie) return null;

  return (
    <div style={{ 
      position: "relative", 
      height: "80vh", 
      width: "100%", 
      display: "flex", 
      alignItems: "flex-end", 
      padding: "40px" 
    }}>
      {/* 
         1. PERFORMANCE FIX: 
         We use Next.js <Image /> with 'fill' and 'priority' for speed.
         We use inline styles for 'objectFit' so it works without Tailwind.
      */}
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        fill
        priority
        sizes="100vw"
        style={{ 
          objectFit: "cover", // Ensures it covers the screen like a background
          objectPosition: "center",
          zIndex: -1 // Puts it behind the text
        }}
      />

      {/* 2. STYLE RESTORATION: Dark Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          zIndex: 0
        }}
      />

      {/* 3. CONTENT: Text and Buttons */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: "600px", color: "white" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>
          {movie.title}
        </h1>

        <p style={{ marginTop: "10px", opacity: 0.9, fontSize: "1.1rem", lineHeight: "1.5" }}>
          {movie.overview ? movie.overview.slice(0, 150) + "..." : ""}
        </p>

        <Link
          href={`/movie/${movie.id}`}
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 25px",
            border: "none",
            borderRadius: "6px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "none"
          }}
        >
          ▶ Watch Now
        </Link>
      </div>
    </div>
  );
}
