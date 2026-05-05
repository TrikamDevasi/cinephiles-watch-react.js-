"use client";
import { useEffect, useState } from "react";
import { X, Tv, ShoppingCart, Play, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRegion } from "@/context/RegionContext";

export default function WatchNowModal({ movieId, movieTitle, imdbId, onClose }) {
  const { region } = useRegion();
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    async function fetchProviders() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/tmdb/movie/${movieId}/watch-providers?region=${region}`);
        const data = await res.json();
        const regionData = data?.results?.[region] ?? null;
        setProviders(regionData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (movieId) fetchProviders();
  }, [movieId, region]);

  const streaming = providers?.flatrate ?? [];
  const rent      = providers?.rent      ?? [];
  const buy       = providers?.buy       ?? [];
  const hasAny    = streaming.length + rent.length + buy.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="watch-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Where to Watch</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>{movieTitle}</p>
            </div>
            <button onClick={onClose} style={{ color: "var(--color-text-muted)" }}>
              <X size={24} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--color-text-muted)", marginBottom: "1.5rem", padding: "8px 12px", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", width: "fit-content" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
            Showing for {region === "IN" ? "🇮🇳 India" : "🇺🇸 United States"}
          </div>

          {imdbId && (
            <div style={{ marginBottom: "1.5rem" }}>
              <button
                onClick={() => window.open(`https://www.playimdb.com/title/${imdbId}`, '_blank', 'noopener,noreferrer')}
                className="btn-watch-now"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <Play size={16} fill="currentColor" />
                <span>Watch for Free</span>
                <ExternalLink size={14} />
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <Loader2 size={32} className="spin-icon" style={{ margin: "0 auto 12px", color: "var(--color-accent)" }} />
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>Finding options...</p>
            </div>
          )}

          {!loading && error && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p style={{ color: "var(--color-text-secondary)" }}>Failed to load data.</p>
            </div>
          )}

          {!loading && !error && !hasAny && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>Not available in your region.</p>
              <a
                href={`https://www.justwatch.com/in/search?q=${encodeURIComponent(movieTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ display: "inline-flex" }}
              >
                Search on JustWatch
              </a>
            </div>
          )}

          {!loading && !error && hasAny && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {streaming.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                    <Play size={14} />
                    Stream
                  </div>
                  <div className="provider-logo-grid">
                    {streaming.map((p) => (
                      <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={48} height={48} style={{ borderRadius: "var(--radius-sm)" }} />
                        <span style={{ fontSize: "0.6rem", textAlign: "center", color: "var(--color-text-secondary)", maxWidth: "64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {rent.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                    <Tv size={14} />
                    Rent
                  </div>
                  <div className="provider-logo-grid">
                    {rent.map((p) => (
                      <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={48} height={48} style={{ borderRadius: "var(--radius-sm)" }} />
                        <span style={{ fontSize: "0.6rem", textAlign: "center", color: "var(--color-text-secondary)", maxWidth: "64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {buy.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
                    <ShoppingCart size={14} />
                    Buy
                  </div>
                  <div className="provider-logo-grid">
                    {buy.map((p) => (
                      <a key={p.provider_id} href={providers.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <Image src={`https://image.tmdb.org/t/p/w92${p.logo_path}`} alt={p.provider_name} width={48} height={48} style={{ borderRadius: "var(--radius-sm)" }} />
                        <span style={{ fontSize: "0.6rem", textAlign: "center", color: "var(--color-text-secondary)", maxWidth: "64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.provider_name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .spin-icon { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
