"use client";
import { createContext, useContext, useState, useEffect } from "react";

const RegionContext = createContext({ region: "IN", setRegion: () => {} });

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState("IN");

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cinephiles-region");
    if (saved === "IN" || saved === "US") setRegionState(saved);
  }, []);

  function setRegion(r) {
    setRegionState(r);
    localStorage.setItem("cinephiles-region", r);
  }

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export const useRegion = () => useContext(RegionContext);
