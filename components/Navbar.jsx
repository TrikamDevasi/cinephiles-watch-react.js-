"use client";

import { useState, useEffect } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setShowOverlay(query.trim().length > 0);
  }, [query]);

  return (
    <header
      style={{
        width: "100%",
        padding: "20px",
        background: "#111",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <a href="/" style={{ fontSize: "22px", fontWeight: "bold" }}>
        Cinephiles Watch
      </a>

      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "200px",
          borderRadius: "6px",
          border: "none",
          background: "#222",
          color: "#fff",
        }}
      />

      {showOverlay && <SearchOverlay query={query} />}
    </header>
  );
}


