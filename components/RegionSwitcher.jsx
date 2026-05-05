"use client";
import { Globe } from "lucide-react";
import { useRegion } from "@/context/RegionContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const REGIONS = [
  { code: "IN", label: "India",         flag: "🇮🇳" },
  { code: "US", label: "United States", flag: "🇺🇸" },
];

export default function RegionSwitcher() {
  const { region, setRegion } = useRegion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSwitch = (code) => {
    setRegion(code);
    
    // Update the URL so server components (like the homepage) can re-fetch
    const params = new URLSearchParams(searchParams);
    params.set("region", code);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="region-switcher-wrapper">
      <Globe size={14} className="region-globe-icon" />
      <span className="region-label">MARKET:</span>
      <div className="region-pill-group">
        {REGIONS.map(({ code, label }) => (
          <button
            key={code}
            className={`region-pill ${region === code ? "active" : ""}`}
            onClick={() => handleSwitch(code)}
            aria-pressed={region === code}
            aria-label={`Switch market to ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
