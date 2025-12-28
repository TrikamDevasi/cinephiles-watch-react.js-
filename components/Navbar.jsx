"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileSearch, setMobileSearch] = useState(false);

  const abortRef = useRef(null);
  const boxRef = useRef(null);
  const router = useRouter();

  /* =======================
     SCROLL EFFECT
  ======================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =======================
     FETCH POPULAR (ONCE)
  ======================= */
  useEffect(() => {
    if (cachedPopular) {
      setPopular(cachedPopular);
      return;
    }

    async function fetchPopular() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        const movies = (data.results || []).slice(0, 6);
        cachedPopular = movies;
        setPopular(movies);
      } catch {
        setPopular([]);
      }
    }

    fetchPopular();
  }, []);

  /* =======================
     SEARCH (DEBOUNCED + ABORT)
  ======================= */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasFetched(false);
      return;
    }

    if (cachedSearch[query]) {
      setResults(cachedSearch[query]);
      setHasFetched(true);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setHasFetched(false);

        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        const movies = (data.results || []).slice(0, 6);

        cachedSearch[query] = movies;
        setResults(movies);
        setHasFetched(true);
      } catch (e) {
        if (e.name !== "AbortError") {
          setResults([]);
          setHasFetched(true);
        }
      } finally {
        setLoading(false);
        setActiveIndex(-1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  /* =======================
     KEYBOARD NAVIGATION
  ======================= */
  function handleKeyDown(e) {
    const list = results.length > 0 ? results : popular;
    if (!list.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((i) => (i + 1) % list.length);
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((i) => (i - 1 + list.length) % list.length);
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      selectMovie(list[activeIndex].id);
    }
  }

  function selectMovie(id) {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
    setMobileSearch(false);
    router.push(`/movie/${id}`);
  }

  /* =======================
     CLICK OUTSIDE CLOSE
  ======================= */
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* =======================
     TEXT HIGHLIGHT
  ======================= */
  function highlight(text) {
    return text.replace(
      new RegExp(`(${query})`, "ig"),
      `<mark style="background:var(--accent);color:white">$1</mark>`
    );
  }

  /* =======================
     SKELETON ROW
  ======================= */
  function SkeletonRow() {
    return (
      <div style={{ display: "flex", gap: 10, padding: 10 }}>
        <div style={{ width: 40, height: 60, background: "#222", borderRadius: 6 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, width: "70%", background: "#222", borderRadius: 4, marginBottom: 6 }} />
          <div style={{ height: 10, width: "40%", background: "#222", borderRadius: 4 }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {(results.length > 0 || loading) && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backdropFilter: "blur(10px)",
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
        />
      )}

      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: scrolled ? "rgba(0,0,0,0.9)" : "transparent",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="logo-wrapper"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              padding: 2,
              background:
                "linear-gradient(135deg, var(--accent), transparent 60%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--bg-soft)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <Image
                src="https://yt3.ggpht.com/f5IUmMxtzm3akK0IGpSDbJU6akFnsKcnRK8Y802g4lQfRvUJm2D0Z8M3QRK9FxN-tf5ERrrr=s800-c-k-c0x00ffffff-no-rj"
                alt="Cinephiles Watch"
                width={40}
                height={40}
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <span style={{ fontWeight: 700 }}>Cinephiles Watch</span>
        </Link>

        {/* SEARCH */}
        <div ref={boxRef} style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => window.innerWidth < 640 && setMobileSearch(true)}
            placeholder="Search movies"
            style={{
              width: 260,
              padding: "8px 14px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.1)",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.2)",
              outline: "none",
            }}
          />

          {query && (
            <div
              style={{
                position: mobileSearch ? "fixed" : "absolute",
                inset: mobileSearch ? 0 : "auto",
                top: mobileSearch ? 0 : "110%",
                width: "100%",
                height: mobileSearch ? "100vh" : "auto",
                background: "var(--bg-soft)",
                borderRadius: mobileSearch ? 0 : 10,
                zIndex: 60,
                paddingTop: mobileSearch ? 80 : 0,
                overflow: "auto",
              }}
            >
              {mobileSearch && (
                <button
                  onClick={() => setMobileSearch(false)}
                  style={{ position: "absolute", top: 20, right: 20 }}
                >
                  ✕
                </button>
              )}

              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {!loading &&
                results.length > 0 &&
                results.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => selectMovie(m.id)}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: 10,
                      cursor: "pointer",
                      background: i === activeIndex ? "#222" : "transparent",
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                      alt={m.title}
                      style={{ width: 40, borderRadius: 6 }}
                    />
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: highlight(m.title),
                        }}
                      />
                      <div style={{ fontSize: 12, opacity: 0.6 }}>
                        {GENRES[m.genre_ids?.[0]] || "Movie"} •{" "}
                        {m.release_date?.slice(0, 4)}
                      </div>
                    </div>
                  </div>
                ))}

              {!loading && hasFetched && results.length === 0 && (
                <>
                  <div style={{ padding: "8px 12px", fontSize: 12, opacity: 0.6 }}>
                    Popular movies
                  </div>
                  {popular.map((m, i) => (
                    <div
                      key={m.id}
                      onClick={() => selectMovie(m.id)}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: 10,
                        cursor: "pointer",
                        background: i === activeIndex ? "#222" : "transparent",
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                        alt={m.title}
                        style={{ width: 40, borderRadius: 6 }}
                      />
                      <div>{m.title}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
