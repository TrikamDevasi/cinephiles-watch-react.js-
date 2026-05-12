"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, BookmarkPlus, Check, Play, Loader2 } from "lucide-react";
import useWatchlistStore from "@/store/useWatchlistStore";
import PlayerModal from "@/components/PlayerModal";

export default function MovieCard({ movie }) {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  
  const [playerOpen, setPlayerOpen] = useState(false);
  const [imdbId, setImdbId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const isInWatchlist = watchlist.some((m) => m.id === movie.id);
  
  const img = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : "/placeholder.png";

  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleWatchNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (imdbId) {
      setPlayerOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/movie?id=${movie.id}`);
      const data = await res.json();
      setImdbId(data.data?.imdb_id);
      setPlayerOpen(true);
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const isReleased = movie.release_date && new Date(movie.release_date) <= new Date();

  return (
    <Link href={`/movie/${movie.id}`} className="movie-card-container">
      <div className="movie-card">
        {/* RATING BADGE (Visible always on small mobile if needed, but here as standard) */}
        {rating && rating > 0 && (
          <div className="rating-badge">
            <Star size={10} fill="currentColor" stroke="none" />
            <span>{rating}</span>
          </div>
        )}

        {/* POSTER */}
        <div className="poster-wrapper">
          <Image
            src={img}
            alt={movie.title}
            fill
            sizes="(max-width: 480px) 120px, (max-width: 768px) 160px, 200px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>

        {/* QUICK ACTIONS OVERLAY */}
        <div className="card-hover-overlay" style={{ display: "flex", gap: "8px" }}>
          {isReleased && (
            <button 
              className="card-play-btn"
              onClick={handleWatchNow}
              title="Watch Now"
              disabled={loading}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="white" />}
            </button>
          )}
          <button 
            className={`card-add-btn ${isInWatchlist ? 'active' : ''}`}
            onClick={handleWatchlist}
            title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {isInWatchlist ? <Check size={18} /> : <BookmarkPlus size={18} />}
          </button>
        </div>
      </div>

      {playerOpen && (
        <PlayerModal
          movieTitle={movie.title}
          imdbId={imdbId}
          onClose={() => setPlayerOpen(false)}
        />
      )}

      <style jsx>{`
        .card-play-btn {
          background: var(--color-accent);
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-play-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 0 15px var(--color-accent);
        }
        .card-play-btn:disabled {
          background: #333;
          cursor: not-allowed;
        }
      `}</style>
      
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        {year && <span className="movie-card-year">{year}</span>}
      </div>
    </Link>
  );
}
