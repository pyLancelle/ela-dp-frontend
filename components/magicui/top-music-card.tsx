"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { Music, User } from "lucide-react";
import Link from "next/link";

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

function Avatar({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  if (src) {
    return <img src={src} alt={alt} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />;
  }
  return (
    <div className={`w-8 h-8 rounded-md bg-gradient-to-br ${gradientFor(fallback)} flex items-center justify-center flex-shrink-0`}>
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
      <div className={cn("flex items-start justify-between mb-3", loading && "invisible")}>
        <div className="flex items-center gap-2">
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
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex-1 flex items-center gap-2 px-2">
                  <div className="h-3 w-4 rounded bg-muted/30 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                  <div className="w-8 h-8 rounded-md bg-muted/40 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 rounded bg-muted/40 animate-pulse" style={{ width: `${60 + (i % 3) * 15}%`, animationDelay: `${i * 60}ms` }} />
                    <div className="h-2 w-12 rounded bg-muted/30 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
                  </div>
                  <div className="h-2.5 w-10 rounded bg-muted/30 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 60}ms` }} />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={showArtists ? "artists" : "tracks"}
              initial={{ opacity: 0, x: showArtists ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showArtists ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {showArtists
                ? topArtists?.map((artist, i) => (
                    <motion.div
                      key={artist.rank}
                      initial={{ opacity: 0, y: 6 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
                      className="flex-1 flex items-center gap-2 px-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-xs font-semibold w-4 flex-shrink-0 text-muted-foreground tabular-nums">
                        {artist.rank}
                      </span>
                      <Avatar src={artist.imageUrl ?? undefined} alt={artist.name} fallback={artist.name} />
                      <div className="flex-1 min-w-0">
                        {/* TODO: use ?id=<artist_id> once available in dashboard API */}
                        <Link
                          href={`/music/artists?name=${encodeURIComponent(artist.name)}`}
                          className="text-xs font-medium truncate block hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {artist.name}
                        </Link>
                        <div className="text-[10px] text-muted-foreground">{artist.trackCount} plays</div>
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground tabular-nums flex-shrink-0">
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
                      className="flex-1 flex items-center gap-2 px-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <span className="text-xs font-semibold w-4 flex-shrink-0 text-muted-foreground tabular-nums">
                        {track.rank}
                      </span>
                      <Avatar src={track.imageUrl ?? undefined} alt={track.name} fallback={track.name} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{track.name}</div>
                        <Link
                          href={`/music/artists?name=${encodeURIComponent(track.artistName)}`}
                          className="text-[10px] text-muted-foreground truncate block hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {track.artistName}
                        </Link>
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground tabular-nums flex-shrink-0">
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
