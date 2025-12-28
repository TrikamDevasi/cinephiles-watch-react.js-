"use client";

import { useEffect, useState } from "react";

/**
 * NotifyButton
 * Stores movie IDs in localStorage for future notification features
 * (email / push / release-day reminders)
 */
export default function NotifyButton({ movieId }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("notify_movies") || "[]"
    );
    setEnabled(stored.includes(movieId));
  }, [movieId]);

  function toggleNotify() {
    const stored = JSON.parse(
      localStorage.getItem("notify_movies") || "[]"
    );

    let updated;

    if (stored.includes(movieId)) {
      updated = stored.filter((id) => id !== movieId);
      setEnabled(false);
    } else {
      updated = [...stored, movieId];
      setEnabled(true);
    }

    localStorage.setItem("notify_movies", JSON.stringify(updated));
  }

  return (
    <button
      onClick={toggleNotify}
      style={{
        marginTop: 8,
        padding: "6px 10px",
        fontSize: 12,
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.2)",
        background: enabled
          ? "rgba(22,163,74,0.15)"
          : "rgba(255,255,255,0.08)",
        color: enabled ? "#16a34a" : "inherit",
        cursor: "pointer",
      }}
    >
      {enabled ? "Notification set" : "Notify me"}
    </button>
  );
}
