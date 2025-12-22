"use client";

import { useState } from "react";
import CastGrid from "./CastGrid";
import SimilarMovies from "./SimilarMovies";
import Screenshots from "./Screenshots";
import TrailerModal from "./TrailerModal";

export default function MovieDetails({ movie, similar }) {
  const [trailer, setTrailer] = useState(null);

  const video =
    movie?.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div style={{ color: "white", paddingBottom: "50px" }}>
      {/* Backdrop */}
      <div
        style={{
          height: "70vh",
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,1))",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "40px",
            width: "50%",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            {movie.title}
          </h1>

          <p style={{ opacity: 0.9, marginTop: "10px", maxWidth: "600px" }}>
            {movie.overview}
          </p>

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setTrailer(video?.key)}
              style={{
                padding: "12px 25px",
                background: "#ffffff",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                marginRight: "15px",
              }}
            >
              ▶ Watch Trailer
            </button>

            <span style={{ fontSize: "18px", opacity: 0.8 }}>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Poster + Info */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          padding: "40px",
          marginTop: "-150px",
        }}
      >
        <img
          src={poster}
          style={{
            width: "260px",
            borderRadius: "12px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.5)",
          }}
        />

        <div>
          <h2 style={{ marginBottom: "10px" }}>Movie Info</h2>

          <p><b>Release Date:</b> {movie.release_date}</p>
          <p><b>Runtime:</b> {movie.runtime} min</p>

          <p style={{ margin: "20px 0" }}>
            {movie.genres.map((g) => (
              <span
                key={g.id}
                style={{
                  padding: "6px 12px",
                  background: "#222",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                {g.name}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Cast */}
      <CastGrid cast={movie.credits.cast} />

      {/* Screenshots */}
      <Screenshots images={movie.images.backdrops} />

      {/* Similar Movies */}
      <SimilarMovies movies={similar} />

      {/* Trailer Modal */}
      {trailer && <TrailerModal videoKey={trailer} onClose={() => setTrailer(null)} />}
    </div>
  );
}
