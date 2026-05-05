"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, Play, Bookmark, BookmarkPlus, ExternalLink, Clock, Calendar } from "lucide-react";
import CastGrid from "./CastGrid";
import SimilarMovies from "./SimilarMovies";
import Screenshots from "./Screenshots";
import TrailerModal from "./TrailerModal";
import { PROVIDER_LOGOS } from "@/utils/providerLogos";
import useWatchlistStore from "@/store/useWatchlistStore";
import dynamic from "next/dynamic";

const PlayerModal = dynamic(() => import("./PlayerModal"), { ssr: false });
const WatchNowModal = dynamic(() => import("./WatchNowModal"), { ssr: false });

function releaseStatus(dateStr) {
  if (!dateStr) return "Unknown";
  const today = new Date().toISOString().split("T")[0];
  if (dateStr === today) return "Releasing Today";
  if (dateStr > today) return "Upcoming";
  return "Released";
}

import TraktStats from "./TraktStats";

import NotifyButton from "./NotifyButton";

import { useRegion } from "@/context/RegionContext";

export default function MovieDetails({ 
  movie, 
  similar, 
  omdb,
  traktRatings,
  traktStats,
  traktRelated
}) {
  const [trailer, setTrailer] = useState(null);
  const [watchModalOpen, setWatchModalOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const { region } = useRegion();
  const [watchProviders, setWatchProviders] = useState(null);

  useEffect(() => {
    if (!movie?.id) return;
    fetch(`/api/tmdb/movie/${movie.id}/watch-providers?region=${region}`)
      .then(async (res) => {
        const text = await res.text();
        if (!text) return null;
        try { return JSON.parse(text); } catch { return null; }
      })
      .then(data => {
        if (data) setWatchProviders(data);
      })
      .catch(err => console.error("Failed to load providers:", err));
  }, [movie.id, region]);

  const regionProviders = watchProviders?.results?.[region];
  const streamingList = regionProviders?.flatrate ?? [];
  const rentList      = regionProviders?.rent      ?? [];
  const buyList       = regionProviders?.buy        ?? [];

  const isSaved = watchlist.some((m) => m.id === movie.id);

  const toggleWatchlist = () => {
    if (isSaved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const video =
    movie?.videos?.results?.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || null;

  const backdrop = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  const poster = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;

  const releaseDate = movie?.release_date ? new Date(movie.release_date) : null;
  const isComingSoon = releaseDate ? releaseDate > new Date() : false;
  const isTheatrical = releaseDate ? (new Date() - releaseDate) < (45 * 24 * 60 * 60 * 1000) && (new Date() - releaseDate) >= 0 : false;
  const showWatchNow = !isComingSoon && !isTheatrical;

  return (
    <div className="movie-details-page animate-in">
      {/* HERO SECTION */}
      <div className="movie-hero">
        <div className="movie-hero-backdrop">
          <Image
            src={backdrop}
            alt={movie.title}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div className="movie-hero-overlay" />
        </div>

        <div className="movie-hero-content container">
          <div className="movie-hero-meta">
            <div className="meta-pill rating">
              <Star size={16} fill="var(--color-gold)" stroke="none" />
              <span>{movie?.vote_average?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="meta-pill">
              <Clock size={16} />
              <span>{movie?.runtime || "??"} min</span>
            </div>
            <div className="meta-pill">
              <Calendar size={16} />
              <span>{movie?.release_date?.slice(0, 4) || "????"}</span>
            </div>
            {omdb?.rottenTomatoes && (
              <div className="meta-pill rt">
                <span className="rt-icon" />
                <span>{omdb.rottenTomatoes}</span>
              </div>
            )}
            {omdb?.metascore && (
              <div className="meta-pill metascore" style={{ background: parseInt(omdb.metascore) > 60 ? "#66cc33" : "#ffcc33", color: "black", fontWeight: 800 }}>
                <span>{omdb.metascore}</span>
              </div>
            )}
          </div>

          <h1 className="movie-hero-title">{movie?.title}</h1>
          <p className="movie-hero-overview">{movie?.overview}</p>

          <div className="movie-hero-actions">
            {showWatchNow && (
              <button
                className="btn-watch-now"
                onClick={() => {
                  if (movie?.imdb_id) {
                    setPlayerOpen(true);
                  } else {
                    setWatchModalOpen(true);
                  }
                }}
              >
                <Play size={16} fill="currentColor" />
                Watch Now
              </button>
            )}

            {video && (
              <button onClick={() => setTrailer(video.key)} className="btn-primary">
                <Play size={20} fill="white" />
                <span>Watch Trailer</span>
              </button>
            )}

            <button onClick={toggleWatchlist} className={isSaved ? "btn-secondary saved" : "btn-secondary"}>
              {isSaved ? <Bookmark size={20} fill="white" /> : <BookmarkPlus size={20} />}
              <span>{isSaved ? "In Watchlist" : "Add to Watchlist"}</span>
            </button>

            {movie?.imdb_id && (
              <a 
                href={`https://www.imdb.com/title/${movie?.imdb_id}`} 
                target="_blank" 
                rel="noreferrer"
                className="imdb-link"
              >
                <span>IMDb</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container movie-main-grid">
        {/* POSTER SIDEBAR */}
        <div className="movie-sidebar">
          <div className="movie-poster-card">
            <Image
              src={poster}
              alt={movie?.title || "Movie Poster"}
              width={300}
              height={450}
              priority
              className="movie-poster-img"
            />
          </div>

          <div className="movie-info-block">
            <h3 className="block-title">Where to Watch</h3>
            {streamingList.length > 0 && (
              <div className="provider-section" style={{ marginBottom: "1rem" }}>
                <span className="provider-type-label">Stream</span>
                <div className="provider-logos">
                  {streamingList.map(p => (
                    <img
                      key={p.provider_id}
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className="provider-logo"
                      width={36}
                      height={36}
                    />
                  ))}
                </div>
              </div>
            )}

            {(rentList.length > 0 || buyList.length > 0) && (
              <div className="provider-section">
                <span className="provider-type-label">Rent / Buy</span>
                <div className="provider-logos">
                  {[...rentList, ...buyList].map((p, i) => (
                    <img
                      key={i}
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      alt={p.provider_name}
                      title={p.provider_name}
                      className="provider-logo"
                      width={32}
                      height={32}
                      style={{ opacity: 0.7 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {!streamingList.length && !rentList.length && !buyList.length && (
              <p className="no-data">Not available digitally in your region.</p>
            )}

            <p className="provider-region-note">
              Showing availability for {region === "IN" ? "India 🇮🇳" : "United States 🇺🇸"}
            </p>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <NotifyButton movieId={movie.id} />
          </div>
        </div>

        {/* DETAILS CONTENT */}
        <div className="movie-content">
          <div className="genre-list">
            {movie?.genres?.map((g) => (
              <span key={g.id} className="genre-pill">{g.name}</span>
            ))}
          </div>

          <div className="info-grid">
            {(movie?.runtime ?? 0) > 0 && (
              <div className="info-item">
                <span className="info-label">Runtime</span>
                <span className="info-value">{movie?.runtime} min</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Original Language</span>
              <span className="info-value uppercase">{movie?.original_language || "N/A"}</span>
            </div>
            {movie?.budget > 0 && typeof movie.budget === 'number' && (
              <div className="info-item">
                <span className="info-label">Budget</span>
                <span className="info-value">${(movie.budget / 1000000).toFixed(1)}M</span>
              </div>
            )}
          </div>

          <TraktStats ratings={traktRatings} stats={traktStats} />

          <div className="cast-section">
            <CastGrid cast={movie?.credits?.cast || []} />
          </div>
          <Screenshots images={movie?.images?.backdrops || []} />
        </div>
      </div>

      <div className="container" style={{ marginTop: "60px" }}>
        <SimilarMovies movies={similar} />
      </div>

      {trailer && (
        <TrailerModal
          videoKey={trailer}
          onClose={() => setTrailer(null)}
        />
      )}

      {watchModalOpen && (
        <WatchNowModal
          movieId={movie.id}
          movieTitle={movie.title}
          imdbId={movie?.imdb_id}
          onClose={() => setWatchModalOpen(false)}
        />
      )}

      {playerOpen && (
        <PlayerModal
          movieTitle={movie.title}
          imdbId={movie.imdb_id}
          onClose={() => setPlayerOpen(false)}
        />
      )}

      <style jsx>{`
        .movie-hero {
          position: relative;
          height: 80vh;
          min-height: 700px;
          display: flex;
          align-items: flex-end;
          padding-bottom: 100px;
          overflow: hidden;
        }
        .movie-hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: -1;
        }
        .movie-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--color-bg) 0%, rgba(10,10,15,0.4) 50%, transparent 100%),
                      linear-gradient(to right, var(--color-bg) 20%, transparent 80%);
        }
        .movie-hero-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .meta-pill.rt {
          border-color: #fa320a;
          color: #fa320a;
        }
        .rt-icon {
          width: 12px;
          height: 12px;
          background: #fa320a;
          border-radius: 50%;
          display: inline-block;
        }
        .meta-pill.metascore {
          border: none;
          min-width: 32px;
          justify-content: center;
        }
        .movie-hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.1;
        }
        .movie-hero-overview {
          max-width: 700px;
          font-size: 1.1rem;
          color: var(--color-text-secondary);
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .movie-hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-secondary.saved {
          background: var(--color-accent);
          border-color: var(--color-accent);
        }
        .imdb-link {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--color-gold);
          font-size: 0.9rem;
          padding: 10px 16px;
        }
        .movie-main-grid {
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          gap: 60px;
          margin-top: -100px;
          position: relative;
          z-index: 20;
        }
        .movie-content {
          min-width: 0;
        }
        .movie-poster-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          margin-bottom: 32px;
        }
        .movie-poster-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .movie-info-block {
          background: var(--color-surface);
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          margin-bottom: 20px;
        }
        .block-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          margin-bottom: 16px;
        }
        .provider-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .provider-logo img {
          width: 44px;
          height: 44px;
          border-radius: 10px;
        }
        .provider-list.small .provider-logo img {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          opacity: 0.6;
        }
        .no-data {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .genre-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 32px;
        }
        .genre-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border);
          padding: 6px 16px;
          border-radius: var(--radius-pill);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          background: var(--color-surface);
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }
        .info-item { display: flex; flex-direction: column; gap: 4px; }
        .info-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); }
        .info-value { font-size: 1.1rem; font-weight: 600; color: var(--color-text-primary); }

        @media (max-width: 1024px) {
          .movie-main-grid {
            grid-template-columns: 1fr;
            margin-top: 40px;
          }
          .movie-poster-card {
            max-width: 300px;
            margin: 0 auto 32px;
          }
        }

        @media (max-width: 640px) {
          .movie-hero {
            height: auto;
            min-height: 80vh;
            padding-bottom: 60px;
            padding-top: 100px;
          }
          .movie-hero-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .movie-hero-actions button, .movie-hero-actions a {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
