"use client";
import { useEffect } from "react";
import { X, Maximize2 } from "lucide-react";

export default function PlayerModal({ movieTitle, imdbId, onClose }) {
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
            <p className="player-subtitle">{movieTitle}</p>
          </div>
          <div className="player-actions">
            <button className="player-close-btn" onClick={onClose} title="Close Player">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe Wrapper */}
        <div className="player-iframe-wrapper">
          <iframe
            src={`${process.env.NEXT_PUBLIC_STREAM_URL || "https://www.playimdb.com/title/"}${imdbId}`}
            className="player-iframe"
            allowFullScreen
            scrolling="no"
            frameBorder="0"
            title={`Streaming ${movieTitle}`}
          />
        </div>

        {/* Footer / Info */}
        <div className="player-footer">
          <p>
            You are watching a free external stream. 
            If the player doesn't load, check your internet connection or try a different movie.
          </p>
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
        }

        .player-iframe {
          width: 100%;
          height: 100%;
          border: none;
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
        }
      `}</style>
    </div>
  );
}
