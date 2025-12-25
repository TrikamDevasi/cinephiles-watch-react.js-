"use client";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner({ movie }) {
  // 1. Safety Check: If no movie or no image, don't break
  if (!movie) return null;
  
  // 2. Image Source with fallback
  const imagePath = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` 
    : null;

  return (
    <div style={{ 
      position: "relative", 
      height: "80vh", 
      width: "100%", 
      display: "flex", 
      alignItems: "flex-end", 
      padding: "40px",
      overflow: "hidden" // Keeps everything tidy
    }}>
      
      {/* LAYER 1: The Image (Bottom) */}
      {imagePath ? (
        <Image
          src={imagePath}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          style={{ 
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 0 // Sit at the bottom, but visible
          }}
        />
      ) : (
        // Fallback if image is missing from API
        <div style={{ position: "absolute", inset: 0, background: "#222", zIndex: 0 }} />
      )}

      {/* LAYER 2: The Gradient Overlay (Middle) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%)",
          zIndex: 10 // Sit on top of image
        }}
      />

      {/* LAYER 3: The Text (Top) */}
      <div style={{ 
        position: "relative", 
        zIndex: 20, // Sit on top of everything
        maxWidth: "700px", 
        color: "white" 
      }}>
        <h1 style={{ 
          fontSize: "4rem", 
          fontWeight: "bold", 
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          marginBottom: "1rem",
          lineHeight: "1.1"
        }}>
          {movie.title}
        </h1>

        <p style={{ 
          fontSize: "1.1rem", 
          lineHeight: "1.6", 
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          marginBottom: "1.5rem",
          color: "#e5e5e5"
        }}>
          {movie.overview ? movie.overview.slice(0, 200) + "..." : "No description available."}
        </p>

        <Link
          href={`/movie/${movie.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 30px",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
            color: "#000",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
            textDecoration: "none",
            transition: "transform 0.2s ease"
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>▶</span> Watch Now
        </Link>
      </div>
    </div>
  );
}
