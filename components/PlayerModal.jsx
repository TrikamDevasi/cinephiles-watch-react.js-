"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Hls from "hls.js";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export default function PlayerModal({ movieTitle, imdbId, season, episode, isSeries, onClose }) {
  const [activeSource, setActiveSource] = useState("playimdb"); // "playimdb" | "multimovies"
  const [activeServer, setActiveServer] = useState("server1"); // "server1" | "server2"
  const [contentNotFound, setContentNotFound] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  // Prevent body scroll when player is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Reset error state when switching sources
  useEffect(() => {
    setContentNotFound(false);
  }, [activeSource, activeServer]);

  const slug = slugify(movieTitle);
  const seriesSlug = `${slug}-${season}x${episode}`;
  
  const streamPath = isSeries 
    ? `/episodes/${seriesSlug}/master.m3u8`
    : `/movies/${slug}/master.m3u8`;

  const multimoviesUrl = `https://${activeServer}.uns.bio${streamPath}`;
  const playimdbUrl = `${process.env.NEXT_PUBLIC_STREAM_URL || "https://www.playimdb.com/title/"}${imdbId}`;

  useEffect(() => {
    if (activeSource === "multimovies" && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(multimoviesUrl);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => console.log("Auto-play blocked:", err));
        });

        // Handle errors (e.g., 404 Not Found)
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.log("HLS fatal error:", data.type);
            setContentNotFound(true);
            hls.destroy();
          }
        });
        
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native support
        video.src = multimoviesUrl;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch(err => console.log("Auto-play blocked:", err));
        });
        video.addEventListener("error", () => {
          setContentNotFound(true);
        });
      }
    }
  }, [activeSource, activeServer, multimoviesUrl]);

  return (
    <div className="player-modal-wrapper">
      {/* Backdrop */}
      <div className="player-backdrop" onClick={onClose} />
      
      {/* Container */}
      <div className="player-container">
        {/* Header */}
        <div className="player-header">
          <div className="player-info">
            <h2 className="player-title">Now Playing</h2>
            <p className="player-subtitle">
              {movieTitle} {isSeries && `(S${season} E${episode})`}
            </p>
          </div>
          
          <div className="player-controls">
            {/* Source Selector */}
            <div className="source-selector">
              <button 
                className={`source-btn ${activeSource === "playimdb" ? "active" : ""}`}
                onClick={() => setActiveSource("playimdb")}
              >
                Auto
              </button>
              <button 
                className={`source-btn ${activeSource === "multimovies" && activeServer === "server1" ? "active" : ""}`}
                onClick={() => {
                  setActiveSource("multimovies");
                  setActiveServer("server1");
                }}
              >
                Server 1
              </button>
              <button 
                className={`source-btn ${activeSource === "multimovies" && activeServer === "server2" ? "active" : ""}`}
                onClick={() => {
                  setActiveSource("multimovies");
                  setActiveServer("server2");
                }}
              >
                Server 2
              </button>
            </div>

            <button className="player-close-btn" onClick={onClose} title="Close Player">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe or Video Wrapper */}
        <div className="player-iframe-wrapper">
          {contentNotFound ? (
            <div className="error-container">
              <div className="error-icon">😕</div>
              <h3 className="error-title">Content Not Found</h3>
              <p className="error-text">The stream is not available on this server yet.</p>
              
              <a
                href="https://t.me/movies_request_group3"
                target="_blank"
                rel="noopener noreferrer"
                className="telegram-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.036 9.589c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.899.632z"/>
                </svg>
                Request Movie / Series
              </a>
            </div>
          ) : activeSource === "playimdb" ? (
            <iframe
              src={playimdbUrl}
              className="player-iframe"
              allowFullScreen
              scrolling="no"
              frameBorder="0"
              title={`Streaming ${movieTitle}`}
            />
          ) : (
            <video
              ref={videoRef}
              className="player-video"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>

        {/* Footer / Info */}
        <div className="player-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <p style={{ margin: 0 }}>
            {activeSource === "playimdb" 
              ? "Streaming from external mirror."
              : `Streaming HLS from MultiMovies (${activeServer}.uns.bio).`}
          </p>
          {activeSource === "playimdb" && (
            <a
              href="https://t.me/movies_request_group3"
              target="_blank"
              rel="noopener noreferrer"
              className="telegram-btn"
              style={{ padding: "6px 12px", fontSize: "12px", gap: "6px" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.036 9.589c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.899.632z"/>
              </svg>
              Request on Telegram
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .player-modal-wrapper {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        .player-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
        }

        .player-container {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 1400px;
          max-height: 90vh;
          background: #000;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 100px rgba(229, 9, 20, 0.2);
          animation: playerPop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        @keyframes playerPop {
          from { transform: scale(0.98); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .player-header {
          padding: 1rem 1.5rem;
          background: #000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .player-info {
          display: flex;
          flex-direction: column;
        }

        .player-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-accent);
          font-weight: 800;
          margin-bottom: 2px;
        }

        .player-subtitle {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .source-selector {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: var(--radius-pill);
        }

        .source-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .source-btn:hover {
          color: white;
        }

        .source-btn.active {
          background: var(--color-accent);
          color: white;
        }

        .player-close-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .player-close-btn:hover {
          background: var(--color-accent);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 0 15px var(--color-accent);
        }

        .player-iframe-wrapper {
          flex: 1;
          position: relative;
          width: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .player-iframe, .player-video {
          width: 100%;
          height: 100%;
          border: none;
        }

        .player-video {
          outline: none;
        }

        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 2rem;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .error-text {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
          max-width: 400px;
        }

        .telegram-btn {
          background: #2CA5E0;
          color: white;
          border-radius: 50px;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(44, 165, 224, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }

        .telegram-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(44, 165, 224, 0.5);
          color: white;
        }

        .player-footer {
          padding: 0.75rem 1.5rem;
          background: #000;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 1024px) {
          .player-container {
            max-height: 100vh;
            border-radius: 0;
          }
          .player-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .player-controls {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
