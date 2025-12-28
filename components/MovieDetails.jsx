"use client";

import { useState } from "react";
import CastGrid from "./CastGrid";
import SimilarMovies from "./SimilarMovies";
import Screenshots from "./Screenshots";
import TrailerModal from "./TrailerModal";
import { PROVIDER_LOGOS } from "@/utils/providerLogos";

function releaseStatus(dateStr) {
  if (!dateStr) return "Unknown";
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Releasing Today";
  if (dateStr > today) return "Upcoming";
  return "Released";
}

export default function MovieDetails({ movie, similar, providers = {}, region = "IN" }) {
  const [trailer, setTrailer] = useState(null);

  const video =
    movie?.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const { streaming = [], rent = [], buy = [] } = providers;

  return (
    <div style={{ color: "white", paddingBottom: "50px" }}>
      {/* ================= BACKDROP ================= */}
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
            width: "55%",
          }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            {movie.title}
          </h1>

          <p style={{ opacity: 0.9, marginTop: "10px", maxWidth: "600px" }}>
            {movie.overview}
          </p>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
            {video && (
              <button
                onClick={() => setTrailer(video.key)}
                style={{
                  padding: "12px 25px",
                  background: "#ffffff",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ▶ Watch Trailer
              </button>
            )}

            <span style={{ fontSize: "18px", opacity: 0.8 }}>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>

            {movie.imdb_id && (
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                style={{ opacity: 0.7, textDecoration: "underline" }}
              >
                IMDb
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ================= POSTER + INFO ================= */}
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

          <p>
            <b>Release Date:</b> {movie.release_date} ({releaseStatus(movie.release_date)})
          </p>
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

          {/* ================= STREAMING PROVIDERS ================= */}
          {(streaming.length || rent.length || buy.length) > 0 && (
            <div style={{ marginTop: "20px" }}>
              {streaming.length > 0 && (
                <>
                  <p><b>Available to stream</b></p>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    {streaming.map((p) => {
                      const logo = PROVIDER_LOGOS[p.provider_id];
                      if (!logo) return null;
                      return (
                        <a key={p.provider_id} href={p.link} target="_blank" rel="noreferrer">
                          <img src={logo} title={p.provider_name} style={{ width: 32 }} />
                        </a>
                      );
                    })}
                  </div>
                </>
              )}

              {rent.length > 0 && (
                <>
                  <p><b>Rent</b></p>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    {rent.map((p) => {
                      const logo = PROVIDER_LOGOS[p.provider_id];
                      if (!logo) return null;
                      return (
                        <a key={p.provider_id} href={p.link} target="_blank" rel="noreferrer">
                          <img src={logo} title={p.provider_name} style={{ width: 28, opacity: 0.8 }} />
                        </a>
                      );
                    })}
                  </div>
                </>
              )}

              {buy.length > 0 && (
                <>
                  <p><b>Buy</b></p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    {buy.map((p) => {
                      const logo = PROVIDER_LOGOS[p.provider_id];
                      if (!logo) return null;
                      return (
                        <a key={p.provider_id} href={p.link} target="_blank" rel="noreferrer">
                          <img src={logo} title={p.provider_name} style={{ width: 28, opacity: 0.8 }} />
                        </a>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= CAST / SCREENSHOTS / SIMILAR ================= */}
      <CastGrid cast={movie.credits.cast} />
      <Screenshots images={movie.images.backdrops} />
      <SimilarMovies movies={similar} />

      {/* ================= TRAILER MODAL ================= */}
      {trailer && (
        <TrailerModal
          videoKey={trailer}
          onClose={() => setTrailer(null)}
        />
      )}
    </div>
  );
}
