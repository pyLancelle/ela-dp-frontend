"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Music, User } from "lucide-react";

interface TopArtist {
  rank: number;
  name: string;
  imageUrl?: string | null;
  trackCount: number;
  totalDuration: string;
}

interface TopTrack {
  rank: number;
  name: string;
  artistName: string;
  imageUrl?: string | null;
  totalDuration: string;
}

interface TopMusicCardProps {
  topArtists?: TopArtist[];
  topTracks?: TopTrack[];
  loading?: boolean;
  className?: string;
}

const GRADIENTS = [
  "from-blue-500 to-purple-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-yellow-500 to-orange-600",
  "from-purple-500 to-pink-600",
  "from-teal-500 to-cyan-600",
];

function gradientFor(name: string) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}

function Avatar({ src, alt, fallback, size = "md" }: { src?: string; alt: string; fallback: string; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-10 h-10" : "w-8 h-8";
  if (src) {
    return <img src={src} alt={alt} className={`${cls} rounded-lg object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${cls} rounded-lg bg-gradient-to-br ${gradientFor(fallback)} flex items-center justify-center flex-shrink-0`}>
      <span className="text-white text-[10px] font-bold">{fallback.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}

export function TopMusicCard({ topArtists, topTracks, loading, className }: TopMusicCardProps) {
  const [showArtists, setShowArtists] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const items = showArtists ? (topArtists ?? []) : (topTracks ?? []);

  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={showArtists ? "user-icon" : "music-icon"}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              {showArtists
                ? <User className="h-4 w-4 text-muted-foreground" />
                : <Music className="h-4 w-4 text-muted-foreground" />
              }
            </motion.div>
          </AnimatePresence>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {showArtists ? "Top Artistes" : "Top Titres"}
            </p>
            <span className="text-[10px] text-muted-foreground">7 derniers jours</span>
          </div>
        </div>

        {/* Toggle pill */}
        <div className="relative flex items-center gap-0.5 liquid-glass-filter rounded-full p-0.5">
          {[
            { id: "artists", icon: <User className="h-3.5 w-3.5" />, active: showArtists, onClick: () => setShowArtists(true) },
            { id: "tracks",  icon: <Music className="h-3.5 w-3.5" />, active: !showArtists, onClick: () => setShowArtists(false) },
          ].map(({ id, icon, active, onClick }) => (
            <button
              key={id}
              onClick={onClick}
              className="relative h-7 w-7 flex items-center justify-center rounded-full z-10"
            >
              {active && (
                <motion.span
                  layoutId="top-music-toggle"
                  className="liquid-glass-pill-active absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full text-muted-foreground text-xs"
            >
              Chargement...
            </motion.div>
          ) : (
            <motion.div
              key={showArtists ? "artists" : "tracks"}
              initial={{ opacity: 0, x: showArtists ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showArtists ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1"
            >
              {showArtists
                ? topArtists?.map((artist, i) => (
                    <motion.div
                      key={artist.rank}
                      initial={{ opacity: 0, y: 6 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-xs font-semibold w-4 flex-shrink-0 text-muted-foreground tabular-nums">
                        {artist.rank}
                      </span>
                      <Avatar src={artist.imageUrl} alt={artist.name} fallback={artist.name} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{artist.name}</div>
                        <div className="text-[10px] text-muted-foreground">{artist.trackCount} plays</div>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground tabular-nums flex-shrink-0">
                        {artist.totalDuration}
                      </div>
                    </motion.div>
                  ))
                : topTracks?.map((track, i) => (
                    <motion.div
                      key={track.rank}
                      initial={{ opacity: 0, y: 6 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-xs font-semibold w-4 flex-shrink-0 text-muted-foreground tabular-nums">
                        {track.rank}
                      </span>
                      <Avatar src={track.imageUrl} alt={track.name} fallback={track.name} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{track.name}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{track.artistName}</div>
                      </div>
                      <div className="text-xs font-medium text-muted-foreground tabular-nums flex-shrink-0">
                        {track.totalDuration}
                      </div>
                    </motion.div>
                  ))
              }
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
