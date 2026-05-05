"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Film, 
  Bookmark, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ChevronRight
} from "lucide-react";
import AiRecommendations from "./AIPanelRecommend";
import useWatchlistStore from "@/store/useWatchlistStore";
import { useThemeStore } from "@/store/useThemeStore";

/* =======================
   IN-MEMORY CACHE
======================= */
let cachedPopular = null;
const cachedSearch = {};

/* =======================
   GENRE MAP
======================= */
const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  18: "Drama",
  27: "Horror",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Sci-Fi",
  10749: "Romance",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [aiOpen, setAiOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { watchlist } = useWatchlistStore();
  const { theme, toggleTheme } = useThemeStore();

  const abortRef = useRef(null);
  const boxRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cachedPopular) {
      setPopular(cachedPopular);
      return;
    }
    async function fetchPopular() {
      try {
        const res = await fetch("/api/tmdb/trending");
        const data = await res.json();
        const movies = (data.data || []).slice(0, 6);
        cachedPopular = movies;
        setPopular(movies);
      } catch {
        setPopular([]);
      }
    }
    fetchPopular();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (cachedSearch[query]) {
      setResults(cachedSearch[query]);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        const movies = (json.data?.results || []).slice(0, 6);
        cachedSearch[query] = movies;
        setResults(movies);
      } catch (e) {
        if (e.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  function handleKeyDown(e) {
    const list = results.length > 0 ? results : popular;
    if (!list.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % list.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + list.length) % list.length);
    }
    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        selectMovie(list[activeIndex].id);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setResults([]);
        setQuery("");
      }
    }
  }

  function selectMovie(id) {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setMobileMenuOpen(false);
    router.push(`/movie/${id}`);
  }

  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav className="navbar" style={{ 
        background: scrolled ? "var(--navbar-bg)" : "transparent",
        borderBottomColor: scrolled ? "var(--color-border)" : "transparent"
      }}>
        <div className="nav-content">
          {/* LOGO */}
          <Link href="/" className="logo">
            <div className="logo-icon">
              <Film size={16} />
            </div>
            <span className="logo-text">CINEPHILES <span className="logo-watch">WATCH</span></span>
          </Link>

          {/* SEARCH BAR */}
          <div className="search-container" ref={boxRef}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {/* SEARCH DROPDOWN */}
            {query && (results.length > 0 || popular.length > 0) && (
              <div 
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  left: 0,
                  right: 0,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
                  overflow: "hidden",
                  zIndex: 200
                }}
              >
                <div style={{ padding: "8px 0" }}>
                  {(results.length > 0 ? results : popular).map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => selectMovie(m.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 16px",
                        cursor: "pointer",
                        background: i === activeIndex ? "var(--color-surface-2)" : "transparent",
                      }}
                    >
                      <div style={{ width: 40, height: 56, flexShrink: 0, position: "relative" }}>
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                          alt={m.title}
                          fill
                          style={{ borderRadius: "4px", objectFit: "cover" }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                          <span style={{ color: "var(--color-accent)", fontSize: "0.7rem", fontWeight: 700 }}>{GENRES[m.genre_ids?.[0]] || "Movie"}</span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{m.release_date?.slice(0, 4)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div 
                  style={{ 
                    padding: "12px 16px", 
                    borderTop: "1px solid var(--color-border)", 
                    fontSize: "0.75rem", 
                    color: "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "var(--color-surface-2)"
                  }}
                >
                  <span>Enter to see all results</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            )}
          </div>

          {/* NAV LINKS (Desktop) */}
          <div className="nav-links">
            <Link href="/watchlist" className="nav-link">
              <Bookmark size={18} />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span style={{ 
                  background: "var(--color-accent)", 
                  color: "white", 
                  fontSize: "10px", 
                  padding: "1px 6px", 
                  borderRadius: "var(--radius-pill)",
                  marginLeft: "-4px"
                }}>
                  {watchlist.length}
                </span>
              )}
            </Link>
            
            <button onClick={() => setAiOpen(true)} className="btn-primary" style={{ padding: "8px 16px", height: "38px", minHeight: "auto", minWidth: "auto", borderRadius: "var(--radius-pill)", background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <Sparkles size={16} />
              <span className="btn-text">Magic AI</span>
            </button>

            <button className="theme-toggle-btn" onClick={toggleTheme} style={{ width: "38px", height: "38px", minHeight: "auto", minWidth: "auto", borderRadius: "50%", background: "var(--color-surface-2)", color: "var(--color-text-primary)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--color-border)" }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="mobile-controls">
            <button className="hamburger-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            <div className="drawer-header">
              <div className="drawer-title">Menu</div>
              <button className="close-drawer-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Film size={20} />
              <span>Browse Movies</span>
            </Link>

            <Link href="/watchlist" onClick={() => setMobileMenuOpen(false)}>
              <Bookmark size={20} />
              <span>My Watchlist ({watchlist.length})</span>
            </Link>
            
            <button onClick={() => { setAiOpen(true); setMobileMenuOpen(false); }}>
              <Sparkles size={20} />
              <span>Magic AI Recommend</span>
            </button>
            
            <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
        </>
      )}

      <AiRecommendations isOpen={aiOpen} onClose={() => setAiOpen(false)} />
      
      <style jsx>{`
        @media (max-width: 1024px) {
          .logo-watch { display: none; }
        }
        @media (max-width: 640px) {
          .logo-text { display: none; }
        }
      `}</style>
    </>
  );
}
