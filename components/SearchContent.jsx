"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard from "@/components/MovieCard";
import { Search, Film, Loader2 } from "lucide-react";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [q]);

  async function performSearch(searchTerm) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      setResults(json.data?.results || []);
    } catch (err) {
      setError("Failed to fetch movies. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="container animate-in" style={{ paddingTop: "100px", minHeight: "100vh", paddingBottom: "60px" }}>
      <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 40px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
          Explore Universe
        </h1>
        <form onSubmit={handleSearch}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={20} style={{ position: "absolute", left: "20px", color: "var(--color-text-muted)" }} />
            <input
              type="text"
              placeholder="Search for movies, actors, or genres..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                padding: "16px 24px 16px 52px",
                borderRadius: "var(--radius-lg)",
                color: "var(--color-text-primary)",
                fontSize: "1rem",
                outline: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-accent)";
                e.target.style.boxShadow = "0 0 0 1px var(--color-accent), 0 10px 30px rgba(229, 9, 20, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
            />
          </div>
        </form>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-text-secondary)" }}>
          <Loader2 size={40} className="spin-icon" style={{ margin: "0 auto 16px", color: "var(--color-accent)" }} />
          <p>Searching through millions of movies...</p>
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", color: "var(--color-accent)", padding: "40px", background: "rgba(229, 9, 20, 0.05)", borderRadius: "var(--radius-md)" }}>
          {error}
        </div>
      )}

      {!loading && results.length === 0 && q && (
        <div style={{ textAlign: "center", padding: "80px 0", maxWidth: "400px", margin: "0 auto", color: "var(--color-text-secondary)" }}>
          <Film size={48} style={{ color: "var(--color-surface-2)", marginBottom: "20px", display: "inline-block" }} />
          <h2 style={{ color: "var(--color-text-primary)", marginBottom: "12px", fontSize: "1.5rem" }}>No results found</h2>
          <p>We couldn't find anything matching "{q}". Try different keywords or check for typos.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "1.5rem", fontWeight: 500 }}>
            Found {results.length} results for "{q}"
          </div>
          <div className="search-results-grid">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
