"use client";

import { useState } from "react";
import { PROVIDER_LOGOS } from "../utils/providerLogos";

/* =======================
   SESSION CACHE (PROVIDERS)
======================= */
const providerCache = {};

export default function Row({ title, movies = [], badge }) {
  const [providersByMovie, setProvidersByMovie] = useState({});

  async function fetchProviders(movieId, region = "IN") {
    const key = `${movieId}_${region}`;
    if (providerCache[key]) {
      setProvidersByMovie((p) => ({ ...p, [movieId]: providerCache[key] }));
      return;
    }

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();

      const streaming = data.results?.[region]?.flatrate || [];
      const rent = data.results?.[region]?.rent || [];
      const buy = data.results?.[region]?.buy || [];

      const payload = { streaming, rent, buy };
      providerCache[key] = payload;
      setProvidersByMovie((p) => ({ ...p, [movieId]: payload }));
    } catch {
      setProvidersByMovie((p) => ({ ...p, [movieId]: null }));
    }
  }

  function badgeColor(b) {
    if (b === "OTT") return "#2563eb";
    if (b === "Today") return "#16a34a";
    return "#b91c1c"; // Theatrical
  }

  if (!movies.length) return null;

  return (
    <section className="row">
      <h2 style={{ marginBottom: 12, fontSize: "1.2rem", fontWeight: 600 }}>
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 10,
        }}
      >
        {movies.map((movie) => {
          const providers = providersByMovie[movie.id];

          return (
            <div
              key={movie.id}
              className="movie-card"
              onMouseEnter={() => fetchProviders(movie.id)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rx = (y - rect.height / 2) / 30;
                const ry = -(x - rect.width / 2) / 30;
                e.currentTarget.style.transform = `
                  perspective(600px)
                  rotateX(${rx}deg)
                  rotateY(${ry}deg)
                  scale(1.05)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
              style={{
                minWidth: 150,
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* BADGE */}
              {badge && (
                <span
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    fontSize: 11,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: badgeColor(badge),
                    color: "#fff",
                    zIndex: 2,
                  }}
                >
                  {badge}
                </span>
              )}

              {/* POSTER */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : "/placeholder.png"
                }
                alt={movie.title}
                loading="lazy"
                decoding="async"
                style={{ borderRadius: 8 }}
              />

              {/* PROVIDERS */}
              {providers && (
                <div style={{ marginTop: 6 }}>
                  {/* STREAMING */}
                  {providers.streaming?.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      {providers.streaming.map((p) => {
                        const logo = PROVIDER_LOGOS[p.provider_id];
                        if (!logo) return null;
                        return (
                          <img
                            key={p.provider_id}
                            src={logo}
                            alt={p.provider_name}
                            title={`Streaming on ${p.provider_name}`}
                            style={{ width: 22, height: 22 }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* RENT / BUY (SUBTLE) */}
                  {(providers.rent?.length > 0 ||
                    providers.buy?.length > 0) && (
                    <div
                      style={{
                        fontSize: 11,
                        opacity: 0.6,
                        marginTop: 2,
                      }}
                    >
                      Rent / Buy available
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
