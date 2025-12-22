"use client";

export default function TrailerModal({ videoKey, onClose }) {
  if (!videoKey) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: "800px",
          background: "#000",
          padding: "20px",
          borderRadius: "10px",
          position: "relative",
        }}
      >
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${videoKey}`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "8px 14px",
            background: "#222",
            border: "none",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
