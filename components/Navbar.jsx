"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Add background color when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        transition: "background-color 0.3s",
        background: scrolled
          ? "rgba(0, 0, 0, 0.9)" // Dark background when scrolled
          : "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)", // Gradient at top
        padding: "15px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* BRAND SECTION */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
        
        {/* YOUR LOGO */}
        <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: "2px solid #e50914" }}>
            <Image 
                src="https://yt3.ggpht.com/f5IUmMxtzm3akK0IGpSDbJU6akFnsKcnRK8Y802g4lQfRvUJm2D0Z8M3QRK9FxN-tf5ERrrr=s800-c-k-c0x00ffffff-no-rj"
                alt="Cinephiles Logo"
                fill
                style={{ objectFit: "cover" }}
            />
        </div>

        {/* TEXT LOGO */}
        <span style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold", letterSpacing: "1px" }}>
          CINEPHILES <span style={{ fontWeight: "300", opacity: 0.8 }}>WATCH</span>
        </span>
      </Link>

      {/* SEARCH BAR (Simplified) */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input 
            type="text" 
            placeholder="Search movies..." 
            style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "8px 15px",
                borderRadius: "20px",
                color: "white",
                outline: "none"
            }}
        />
      </div>
    </nav>
  );
}
