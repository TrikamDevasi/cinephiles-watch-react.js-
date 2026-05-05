"use client";

import { useState } from "react";
import useWatchlistStore from "@/store/useWatchlistStore";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";
import { Bookmark, Trash2, ArrowUpDown, Film } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlistStore();
  const [sortBy, setSortBy] = useState("dateAdded");

  const sorted = [...watchlist].sort((a, b) => {
    if (sortBy === "rating") return b.vote_average - a.vote_average;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return b.addedAt - a.addedAt;
  });

  return (
    <div className="container animate-in" style={{ padding: "100px 1rem 60px" }}>
      <div className="watchlist-toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Bookmark size={28} style={{ color: "var(--color-accent)" }} />
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Your Watchlist
          </h1>
          <span style={{ 
            background: "var(--color-surface-2)", 
            color: "var(--color-text-secondary)", 
            fontSize: "0.85rem", 
            fontWeight: 700, 
            padding: "2px 10px", 
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-border)"
          }}>
            {watchlist.length}
          </span>
        </div>

        {watchlist.length > 0 && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontSize: "0.85rem", 
            color: "var(--color-text-secondary)", 
            background: "var(--color-surface)", 
            padding: "6px 12px", 
            borderRadius: "var(--radius-md)", 
            border: "1px solid var(--color-border)",
            width: "fit-content"
          }}>
            <ArrowUpDown size={14} />
            <span>Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                background: "none", 
                color: "var(--color-text-primary)", 
                border: "none", 
                fontWeight: 600, 
                cursor: "pointer", 
                outline: "none" 
              }}
            >
              <option value="dateAdded">Date Added</option>
              <option value="rating">Rating</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 0", maxWidth: "400px", margin: "0 auto" }}>
          <div style={{ color: "var(--color-surface-2)", marginBottom: "24px", display: "flex", justifyContent: "center" }}>
            <Film size={64} />
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Your watchlist is empty</h2>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "32px", lineHeight: 1.5 }}>
            You haven't added any movies yet. Explore our collection to find your next favorite.
          </p>
          <Link href="/" className="btn-primary" style={{ display: "inline-flex", width: "fit-content" }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="watchlist-grid">
          {sorted.map((movie) => (
            <div key={movie.id} className="watchlist-item" style={{ position: "relative" }}>
              <MovieCard movie={movie} />
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="remove-btn"
                title="Remove from watchlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .remove-btn {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 36px;
          height: 36px;
          background: rgba(10, 10, 15, 0.8);
          backdrop-filter: blur(8px);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          opacity: 0;
          transform: scale(0.8);
          transition: var(--transition);
        }
        .watchlist-item:hover .remove-btn {
          opacity: 1;
          transform: scale(1);
        }
        .remove-btn:hover {
          background: var(--color-accent);
          color: white;
          border-color: var(--color-accent);
        }
        @media (max-width: 768px) {
          .remove-btn {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
