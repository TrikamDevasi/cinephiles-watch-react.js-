"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function PlayerModal({ movieTitle, imdbId, season, episode, isSeries, onClose }) {
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

  const playimdbUrl = `https://playimdb.com/title/${imdbId}/`;

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
          
          <button className="player-close-btn" onClick={onClose} title="Close Player">
            <X size={20} />
          </button>
        </div>

        {/* Iframe Wrapper */}
        <div className="player-iframe-wrapper">
          <iframe
            src={playimdbUrl}
            className="player-iframe"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
            title={`Streaming ${movieTitle}`}
          />
        </div>

        {/* Footer / Info */}
        <div className="player-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
          <p style={{ margin: 0 }}>Streaming from external mirror.</p>
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
          padding: 20px;
        }
        .player-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
        }
        .player-container {
          position: relative;
          background: #0a0a0f;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          width: 100%;
          max-width: 1000px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .player-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .player-title {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin: 0;
        }
        .player-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 4px 0 0 0;
        }
        .player-close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }
        .player-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .player-iframe-wrapper {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background: #000;
        }
        .player-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .player-footer {
          padding: 12px 20px;
          background: #050508;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
        }
        .telegram-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #2ca5e0;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .telegram-btn:hover {
          transform: translateY(-1px);
          background: #2482b3;
        }
      `}</style>
    </div>
  );
}
