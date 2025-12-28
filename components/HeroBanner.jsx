"use client";

import Image from "next/image";

export default function HeroBanner({ movie }) {
  /* =======================
     SKELETON (LOADING STATE)
  ======================= */
  if (!movie) {
    return (
      <div
        className="hero"
        style={{
          height: "70vh",
          background:
            "linear-gradient(110deg, #111 8%, #222 18%, #111 33%)",
          backgroundSize: "200% 100%",
          animation: "skeleton 1.5s infinite linear",
        }}
      />
    );
  }

  return (
    <section
      className="hero"
      style={{
        position: "relative",
        height: "70vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* BACKDROP IMAGE (LCP CRITICAL) */}
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />

      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25))",
        }}
      />

      {/* CONTENT */}
      <div
        className="hero-content"
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          padding: "0 40px",
          maxWidth: 900,
        }}
      >
        <h1
          className="hero-title"
          style={{
            fontSize: "2.2rem",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {movie.title}
        </h1>

        <p
          className="hero-overview"
          style={{
            fontSize: "1rem",
            opacity: 0.85,
            lineHeight: 1.6,
            maxWidth: 700,
          }}
        >
          {movie.overview}
        </p>
      </div>

      {/* MOBILE REFINEMENTS */}
      <style jsx>{`
        @media (max-width: 640px) {
          .hero {
            height: 55vh;
          }

          .hero-content {
            bottom: 16px;
            padding: 16px;
          }

          .hero-title {
            font-size: 1.2rem;
            line-height: 1.3;
          }

          .hero-overview {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
