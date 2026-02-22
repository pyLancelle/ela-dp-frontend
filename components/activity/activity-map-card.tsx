"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const RunMap = dynamic(() => import("@/components/sport/RunMap"), { ssr: false });

// Tracé mock — boucle Boulogne-Billancourt (Parc de Saint-Cloud)
const MOCK_ROUTE: [number, number][] = [
  [48.8350, 2.2280],
  [48.8360, 2.2310],
  [48.8375, 2.2340],
  [48.8390, 2.2360],
  [48.8405, 2.2345],
  [48.8415, 2.2320],
  [48.8420, 2.2290],
  [48.8410, 2.2260],
  [48.8395, 2.2240],
  [48.8375, 2.2235],
  [48.8360, 2.2250],
  [48.8350, 2.2280],
];

interface ActivityMapCardProps {
  coordinates?: [number, number][];
  location?: string;
}

export function ActivityMapCard({ coordinates, location }: ActivityMapCardProps) {
  const route = coordinates && coordinates.length > 0 ? coordinates : MOCK_ROUTE;
  const isMock = !coordinates || coordinates.length === 0;

  return (
    <div className="liquid-glass-card rounded-2xl h-full overflow-hidden relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent absolute top-0 left-0 z-10" />

      {/* Map */}
      <div className="absolute inset-0">
        <RunMap coordinates={route} accentColor="#3b82f6" isDark={true} />
      </div>

      {/* Overlay bas */}
      <div
        className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-center gap-1.5 z-[500]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}
      >
        <MapPin className="h-3 w-3 text-blue-400 flex-shrink-0" />
        <span className="text-[10px] text-white/70 truncate">
          {location ?? "Boulogne-Billancourt"}
        </span>
        {isMock && (
          <span className="ml-auto text-[9px] text-white/30 italic flex-shrink-0">mock</span>
        )}
      </div>
    </div>
  );
}
