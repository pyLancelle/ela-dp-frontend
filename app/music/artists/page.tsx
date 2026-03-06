"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ArtistHeatmap } from "@/components/music/artist/ArtistHeatmap";
import { ArtistListeningChart } from "@/components/music/artist/ArtistListeningChart";
import { useArtistFocusList, useArtistFocus } from "@/hooks/queries";
import { useImageColor } from "@/hooks/use-image-color";
import {
  Music2,
  Flame,
  Calendar,
  BarChart3,
  Disc3,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type {
  ArtistOverview,
  ArtistTopTrack,
  ArtistCalendarDay,
  ArtistHeatmapEntry,
  ArtistAlbum,
  ArtistSummary,
} from "@/types/artist-focus";

// ── Data transformers ────────────────────────────────────────────────────────

function calendarToHeatmap(calendar: ArtistCalendarDay[]) {
  return calendar.map((d) => ({
    date: d.listen_date,
    minutes: Math.round(d.total_duration_ms / 60000),
  }));
}

function calendarToWeeklyChart(calendar: ArtistCalendarDay[]) {
  const START = "2025-07-01";

  // Build lookup from calendar data
  const dayMap = new Map<string, { minutes: number; plays: number }>();
  for (const d of calendar) {
    const dateKey = d.listen_date.slice(0, 10);
    if (dateKey >= START) {
      dayMap.set(dateKey, {
        minutes: Math.round(d.total_duration_ms / 60000),
        plays: d.play_count,
      });
    }
  }

  // Generate all weeks from July 1 (Monday=2025-06-30) to today
  const startDate = new Date("2025-06-30T12:00:00"); // Monday before July 1
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const result: { month: string; plays: number; minutes: number }[] = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    let minutes = 0;
    let plays = 0;
    for (let i = 0; i < 7; i++) {
      const key = cursor.toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (entry) {
        minutes += entry.minutes;
        plays += entry.plays;
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    const weekStart = new Date(cursor);
    weekStart.setDate(cursor.getDate() - 7);
    result.push({
      month: weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      plays,
      minutes,
    });
  }

  return result;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Hero Card ────────────────────────────────────────────────────────────────

function formatSelectorHours(duration: string): string {
  const hMatch = duration.match(/(\d+)h/);
  const mMatch = duration.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1]) : 0;
  const m = mMatch ? parseInt(mMatch[1]) : 0;
  return `${Math.round(h + m / 60)}h`;
}

function HeroContent({
  overview,
  accentColor,
  artists,
  selectedId,
  onSelect,
}: {
  overview: ArtistOverview | null;
  accentColor?: { r: number; g: number; b: number } | null;
  artists: ArtistSummary[];
  selectedId: string | null;
  onSelect: (artistId: string) => void;
}) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const sorted = [...artists].sort((a, b) =>
    a.artist_name.localeCompare(b.artist_name, "fr", { sensitivity: "base" })
  );

  const bgStyle: React.CSSProperties = accentColor
    ? {
        background: `linear-gradient(135deg, rgba(${accentColor.r},${accentColor.g},${accentColor.b},0.3) 0%, rgba(${accentColor.r},${accentColor.g},${accentColor.b},0.08) 60%, transparent 100%)`,
      }
    : {};

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full relative flex p-3" style={bgStyle}>
      {/* Photo carrée à gauche */}
      {overview?.image_url ? (
        <div className="relative z-10 h-full aspect-square flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={overview.image_url}
            alt={overview.artist_name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-full aspect-square flex-shrink-0 bg-muted/50 flex items-center justify-center rounded-lg">
          <Music2 className="w-10 h-10 text-muted-foreground/30" />
        </div>
      )}

      {/* Contenu à droite */}
      <div className="relative z-10 flex flex-col justify-between flex-1 min-w-0 p-5">
        <div>
          <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
            <PopoverTrigger asChild>
              <button
                role="combobox"
                aria-expanded={selectorOpen}
                className={cn(
                  "flex items-center gap-2 text-2xl md:text-3xl font-bold leading-tight mb-1.5 transition-colors cursor-pointer group",
                  overview
                    ? "text-foreground hover:text-foreground/80"
                    : "text-muted-foreground/50 hover:text-muted-foreground/70"
                )}
              >
                <span className="truncate">
                  {overview ? overview.artist_name : "Artiste"}
                </span>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors flex-shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un artiste..." />
                <CommandList>
                  <CommandEmpty>Aucun artiste trouvé.</CommandEmpty>
                  <CommandGroup>
                    {sorted.map((artist) => (
                      <CommandItem
                        key={artist.artist_id}
                        value={artist.artist_name}
                        onSelect={() => {
                          onSelect(artist.artist_id);
                          setSelectorOpen(false);
                        }}
                        className="flex items-center gap-3 py-2"
                      >
                        {artist.image_url ? (
                          <img
                            src={artist.image_url}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {artist.artist_name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatSelectorHours(artist.total_duration)}
                          </p>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            selectedId === artist.artist_id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {overview && overview.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {overview.genres.slice(0, 2).map((g) => (
                <Badge
                  key={g}
                  variant="outline"
                  className="text-[10px] border-foreground/15 text-muted-foreground bg-foreground/5 backdrop-blur-sm"
                >
                  {g}
                </Badge>
              ))}
            </div>
          )}
          {overview && (
            <p className="text-xs text-muted-foreground">
              Découvert le {formatDate(overview.first_heard)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats KPIs ───────────────────────────────────────────────────────────────

function formatDurationHours(durationStr: string): { value: number; unit: string } {
  const hMatch = durationStr.match(/(\d+)h/);
  const mMatch = durationStr.match(/(\d+)m/);
  const h = hMatch ? parseInt(hMatch[1]) : 0;
  const m = mMatch ? parseInt(mMatch[1]) : 0;
  if (h > 0) return { value: Math.round(h + m / 60), unit: "h" };
  return { value: m, unit: "min" };
}

function KpiCard({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col items-center justify-center p-4 gap-1">
      <span className="text-muted-foreground/30">{icon}</span>
      <div className="flex items-baseline gap-0.5">
        <NumberTicker
          value={value}
          className="text-2xl font-black tabular-nums leading-none"
        />
        {suffix && (
          <span className="text-[10px] font-semibold text-muted-foreground/50">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
        {label}
      </span>
    </div>
  );
}

// ── Streak Card ──────────────────────────────────────────────────────────────

function computeWeeklyStreak(calendar: ArtistCalendarDay[]): number {
  // Build set of dates with listens
  const listenDates = new Set(calendar.map((d) => d.listen_date));

  // Walk backwards from current week
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  // Find Monday of current week
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  let streak = 0;
  const cursor = new Date(monday);

  while (true) {
    // Check if this week has at least one listen
    let hasListen = false;
    for (let i = 0; i < 7; i++) {
      const d = new Date(cursor);
      d.setDate(cursor.getDate() + i);
      if (d > today) break;
      if (listenDates.has(d.toISOString().slice(0, 10))) {
        hasListen = true;
        break;
      }
    }
    if (!hasListen) break;
    streak++;
    // Move to previous week
    cursor.setDate(cursor.getDate() - 7);
  }

  return streak;
}

function StreakCard({ streak }: { streak: number }) {
  const isActive = streak > 0;
  return (
    <div className="liquid-glass-card rounded-xl h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 via-transparent to-transparent" />
      )}
      <div className="relative flex flex-col items-center gap-1">
        <Flame
          className={`w-8 h-8 ${
            isActive
              ? "text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]"
              : "text-muted-foreground/20"
          }`}
        />
        <NumberTicker
          value={streak}
          className="text-3xl font-black tabular-nums leading-none"
        />
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">
          {streak === 1 ? "semaine de streak" : "semaines de streak"}
        </span>
      </div>
    </div>
  );
}

// ── Listening Rhythm (hour × day_of_week) ────────────────────────────────

const RHYTHM_DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function ListeningRhythmCard({ heatmap, accentColor }: { heatmap: ArtistHeatmapEntry[]; accentColor?: { r: number; g: number; b: number } | null }) {
  const COLS = 24;
  const ROWS = 7;
  const GAP = 3;
  const DAY_LABEL_W = 10;
  const DAY_LABEL_GAP = 10;
  const HOUR_LABEL_H = 16;

  const grid: number[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  for (const entry of heatmap) {
    const dayIdx = (entry.day_of_week + 5) % 7;
    grid[dayIdx][entry.hour_of_day] = Math.round(entry.total_duration_ms / 60000);
  }
  const max = Math.max(...grid.flat(), 1);

  function getColor(minutes: number): string {
    if (minutes === 0) return "bg-white/5 border border-white/10";
    const ratio = minutes / max;
    if (ratio < 0.15) return "bg-purple-300/40 border border-purple-300/20";
    if (ratio < 0.4) return "bg-purple-400/60 border border-purple-400/30";
    if (ratio < 0.7) return "bg-purple-500/80 border border-purple-500/40";
    return "bg-purple-600/90 border border-purple-600/50";
  }

  function getColorStyle(minutes: number): React.CSSProperties | undefined {
    if (!accentColor) return undefined;
    const { r, g, b } = accentColor;
    if (minutes === 0) return { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
    const ratio = minutes / max;
    if (ratio < 0.15) return { background: `rgba(${r},${g},${b},0.25)`, border: `1px solid rgba(${r},${g},${b},0.15)` };
    if (ratio < 0.4)  return { background: `rgba(${r},${g},${b},0.45)`, border: `1px solid rgba(${r},${g},${b},0.25)` };
    if (ratio < 0.7)  return { background: `rgba(${r},${g},${b},0.65)`, border: `1px solid rgba(${r},${g},${b},0.35)` };
    return { background: `rgba(${r},${g},${b},0.85)`, border: `1px solid rgba(${r},${g},${b},0.5)` };
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(10);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = (width: number, height: number) => {
      const gridW = width - DAY_LABEL_W - DAY_LABEL_GAP;
      const gridH = height - HOUR_LABEL_H - GAP;
      const cellFromW = (gridW - (COLS - 1) * GAP) / COLS;
      const cellFromH = (gridH - (ROWS - 1) * GAP) / ROWS;
      setCellSize(Math.max(6, Math.floor(Math.min(cellFromW, cellFromH))));
    };
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) compute(width, height);
    });
    ro.observe(el);
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) compute(width, height);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2 w-full">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        Rythme d&apos;écoute
      </p>
      <div ref={containerRef} className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full" style={{ gap: `${DAY_LABEL_GAP}px`, minWidth: `${DAY_LABEL_W + DAY_LABEL_GAP + COLS * (cellSize + GAP)}px` }}>
          {/* Day labels */}
          <div
            className="flex flex-col flex-shrink-0 justify-start"
            style={{ width: `${DAY_LABEL_W}px`, gap: `${GAP}px` }}
          >
            {RHYTHM_DAY_LABELS.map((d, i) => (
              <div
                key={i}
                className="text-[8px] text-muted-foreground flex items-center justify-end leading-none flex-shrink-0"
                style={{ height: `${cellSize}px` }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid area */}
          <div className="flex flex-col flex-1 min-w-0">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
                gap: `${GAP}px`,
              }}
            >
              {grid.map((dayRow, dayIdx) =>
                dayRow.map((minutes, hour) => {
                  const label = `${RHYTHM_DAY_LABELS[dayIdx]} ${hour}h — ${minutes} min`;
                  return (
                    <div
                      key={`${dayIdx}-${hour}`}
                      className={`rounded-[3px] transition-transform hover:scale-110 cursor-default ${accentColor ? "" : getColor(minutes)}`}
                      style={getColorStyle(minutes)}
                      title={label}
                    />
                  );
                })
              )}
            </div>
            {/* Hour labels */}
            <div
              className="flex flex-shrink-0"
              style={{ marginTop: `${GAP}px`, height: `${HOUR_LABEL_H}px` }}
            >
              {Array.from({ length: COLS }, (_, h) => (
                <div
                  key={h}
                  className="flex items-start justify-center"
                  style={{ width: `${cellSize}px`, marginRight: h < COLS - 1 ? `${GAP}px` : 0 }}
                >
                  {h % 6 === 0 && (
                    <span className="text-[9px] font-medium text-muted-foreground/60">{h}h</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Albums Card ──────────────────────────────────────────────────────────

function TopAlbumsContent({ albums, accentColor }: { albums: ArtistAlbum[]; accentColor?: { r: number; g: number; b: number } | null }) {
  const realAlbums = albums.filter(
    (a) => a.album_type === "album" || a.total_tracks >= 7
  );
  const sorted = [...realAlbums].sort((a, b) => b.total_plays - a.total_plays);
  const maxPlays = sorted[0]?.total_plays ?? 1;

  const barBg = accentColor
    ? `rgba(${accentColor.r},${accentColor.g},${accentColor.b},0.08)`
    : undefined;

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        Top Albums
      </p>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {sorted.map((album, idx) => {
          const widthPct = (album.total_plays / maxPlays) * 100;
          return (
            <a
              key={album.album_id}
              href={album.album_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div
                className={cn("absolute left-0 top-0 h-full rounded-lg", !accentColor && "bg-cyan-500/5")}
                style={{ width: `${widthPct}%`, ...(barBg ? { background: barBg } : {}) }}
              />
              <span className="relative text-xs font-semibold w-5 flex-shrink-0 text-muted-foreground tabular-nums">
                {idx + 1}
              </span>
              {album.album_image_url ? (
                <img
                  src={album.album_image_url}
                  alt=""
                  className="relative w-8 h-8 rounded-md object-cover flex-shrink-0 border border-white/10"
                />
              ) : (
                <div className="relative w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Disc3 className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              )}
              <div className="relative flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{album.album_name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {album.release_date.slice(0, 4)}
                </p>
              </div>
              <div className="relative flex flex-col items-end flex-shrink-0">
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {album.total_plays} plays
                </span>
                <span className="text-[9px] text-muted-foreground/50 tabular-nums">
                  {album.total_duration}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Albums Mosaic ────────────────────────────────────────────────────────

function AlbumsMosaic({ albums }: { albums: ArtistAlbum[] }) {
  const realAlbums = albums.filter(
    (a) => a.album_type === "album" || a.total_tracks >= 7
  );
  const sorted = [...realAlbums].sort((a, b) => b.release_date.localeCompare(a.release_date));
  const desktopRef = useRef<HTMLDivElement>(null);
  const [coverSize, setCoverSize] = useState(160);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      if (h > 40) setCoverSize(Math.floor(h - 30));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drag to scroll (desktop only)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const hasDragged = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = desktopRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    scrollStart.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 3) hasDragged.current = true;
    desktopRef.current!.scrollLeft = scrollStart.current - dx;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = desktopRef.current;
    if (el) {
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = "grab";
    }
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) e.preventDefault();
  };

  const albumCard = (album: ArtistAlbum, size?: number) => {
    const ratio = album.total_tracks > 0 ? album.tracks_heard / album.total_tracks : 0;
    const depthColor = ratio >= 0.8
      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      : ratio >= 0.4
        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
        : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";

    return (
      <a
        key={album.album_id}
        href={album.album_url}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        className="group flex flex-col gap-1 flex-shrink-0"
      >
        <div
          className="relative rounded-lg overflow-hidden border border-white/10"
          style={size ? { width: size, height: size } : undefined}
        >
          {album.album_image_url ? (
            <img
              src={album.album_image_url}
              alt={album.album_name}
              className={`${size ? "w-full h-full" : "w-full aspect-square"} object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none`}
              draggable={false}
            />
          ) : (
            <div className={`${size ? "w-full h-full" : "w-full aspect-square"} bg-white/5 flex items-center justify-center`}>
              <Disc3 className="w-8 h-8 text-muted-foreground/30" />
            </div>
          )}
        </div>
        <div className="flex-shrink-0" style={size ? { width: size } : undefined}>
          <p className="text-[10px] font-medium truncate leading-tight">
            {album.album_name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[8px] text-muted-foreground/40 tabular-nums">
              {album.release_date.slice(0, 4)}
            </span>
            <Badge
              variant="outline"
              className={`text-[7px] px-1 py-0 h-3.5 tabular-nums ${depthColor}`}
            >
              {album.tracks_heard}/{album.total_tracks}
            </Badge>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2">
      <div className="flex items-center mb-1 flex-shrink-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Discographie
        </p>
        <span className="ml-auto text-[10px] text-muted-foreground/40 tabular-nums">
          {realAlbums.length} albums
        </span>
      </div>

      {/* Mobile: grille verticale */}
      <div className="grid grid-cols-3 gap-2 md:hidden overflow-y-auto flex-1 min-h-0">
        {sorted.map((album) => albumCard(album))}
      </div>

      {/* Desktop: scroll horizontal avec covers dynamiques */}
      <div
        ref={desktopRef}
        className="hidden md:flex gap-3 flex-1 min-h-0 overflow-x-auto overflow-y-hidden items-start pb-1 cursor-grab select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        {sorted.map((album) => albumCard(album, coverSize))}
      </div>
    </div>
  );
}

// ── Top Tracks ───────────────────────────────────────────────────────────────

function TopTracksContent({ tracks, accentColor }: { tracks: ArtistTopTrack[]; accentColor?: { r: number; g: number; b: number } | null }) {
  const maxPlays = tracks[0]?.play_count ?? 1;

  const barBg = accentColor
    ? `rgba(${accentColor.r},${accentColor.g},${accentColor.b},0.08)`
    : undefined;

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex-shrink-0">
        Top Titres
      </p>
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {tracks.map((track) => {
          const widthPct = (track.play_count / maxPlays) * 100;
          return (
            <a
              key={track.track_id}
              href={track.track_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div
                className={cn("absolute left-0 top-0 h-full rounded-lg", !accentColor && "bg-cyan-500/5")}
                style={{ width: `${widthPct}%`, ...(barBg ? { background: barBg } : {}) }}
              />
              <span className="relative text-xs font-semibold w-5 flex-shrink-0 text-muted-foreground tabular-nums">
                {track.track_rank}
              </span>
              {track.album_image_url ? (
                <img
                  src={track.album_image_url}
                  alt=""
                  className="relative w-8 h-8 rounded-md object-cover flex-shrink-0 border border-white/10"
                />
              ) : (
                <div className="relative w-8 h-8 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Music2 className="w-3.5 h-3.5 text-muted-foreground/60" />
                </div>
              )}
              <div className="relative flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{track.track_name}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {track.album_name}
                </p>
              </div>
              <div className="relative flex flex-col items-end flex-shrink-0">
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {track.play_count} plays
                </span>
                <span className="text-[9px] text-muted-foreground/50 tabular-nums">
                  {track.total_duration}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("rounded-xl bg-muted/50 animate-pulse", className)} />;
}

function LoadingSkeleton() {
  return (
    <BentoGrid>
      {/* Hero */}
      <div className="row-span-2 md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-1">
        <SkeletonBlock className="h-full min-h-[120px]" />
      </div>
      {/* 3 KPIs */}
      <div className="md:col-span-1 md:col-start-3 md:row-start-1">
        <SkeletonBlock className="h-full min-h-[100px]" />
      </div>
      <div className="md:col-span-1 md:col-start-4 md:row-start-1">
        <SkeletonBlock className="h-full min-h-[100px]" />
      </div>
      <div className="md:col-span-1 md:col-start-5 md:row-start-1">
        <SkeletonBlock className="h-full min-h-[100px]" />
      </div>
      {/* Streak */}
      <div className="md:col-span-1 md:col-start-6 md:row-start-1">
        <SkeletonBlock className="h-full min-h-[100px]" />
      </div>
      {/* Chart row */}
      <div className="md:col-span-6 md:col-start-1 md:row-start-2">
        <SkeletonBlock className="h-full min-h-[160px]" />
      </div>
      {/* Row 3-4 */}
      <div className="md:col-span-2 md:col-start-1 md:row-start-3">
        <SkeletonBlock className="h-full min-h-[140px]" />
      </div>
      <div className="row-span-2 md:col-span-2 md:col-start-3 md:row-start-3 md:row-span-2">
        <SkeletonBlock className="h-full min-h-[140px]" />
      </div>
      <div className="row-span-2 md:col-span-2 md:col-start-5 md:row-start-3 md:row-span-2">
        <SkeletonBlock className="h-full min-h-[140px]" />
      </div>
      <div className="md:col-span-2 md:col-start-1 md:row-start-4">
        <SkeletonBlock className="h-full min-h-[140px]" />
      </div>
      {/* Discography */}
      <div className="md:col-span-6 md:col-start-1 md:row-start-5">
        <SkeletonBlock className="h-full min-h-[160px]" />
      </div>
    </BentoGrid>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">
          Sélectionne un artiste pour voir ses statistiques
        </p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ArtistFocusPage() {
  return (
    <Suspense>
      <ArtistFocusInner />
    </Suspense>
  );
}

function ArtistFocusInner() {
  const searchParams = useSearchParams();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const { data: indexData } = useArtistFocusList();
  const {
    data: detailData,
    isLoading: isLoadingDetail,
  } = useArtistFocus(selectedArtistId);

  const artists = indexData?.artists ?? [];

  // Auto-select artist from URL search param
  // TODO: accept ?id=<artist_id> directly once classement/homepage APIs provide artist_id
  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam && artists.length > 0 && !selectedArtistId) {
      const match = artists.find(
        (a) => a.artist_name.toLowerCase() === nameParam.toLowerCase()
      );
      if (match) setSelectedArtistId(match.artist_id);
    }
  }, [searchParams, artists, selectedArtistId]);

  const hasData = !!detailData && !!selectedArtistId;

  return (
    <div className="px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      <ArtistContent
        data={hasData ? detailData : null}
        artists={artists}
        selectedId={selectedArtistId}
        onSelect={setSelectedArtistId}
        isLoading={isLoadingDetail && !!selectedArtistId}
      />
    </div>
  );
}

function ArtistContent({
  data,
  artists,
  selectedId,
  onSelect,
  isLoading,
}: {
  data: import("@/types/artist-focus").ArtistFocusDetailResponse | null;
  artists: ArtistSummary[];
  selectedId: string | null;
  onSelect: (artistId: string) => void;
  isLoading: boolean;
}) {
  const overview = data?.overview ?? null;
  const accentColor = useImageColor(overview?.image_url ?? null);
  const showSkeleton = !data || isLoading;

  const heatmapData = data ? calendarToHeatmap(data.calendar) : [];
  const chartData = data ? calendarToWeeklyChart(data.calendar) : [];

  return (
    <BentoGrid>
      {/* Row 1: Hero (2) + 3 KPIs (1 each) + Streak (1) */}
      <BlurFade
        delay={0.05}
        className="row-span-2 md:col-span-2 md:row-span-1 md:col-start-1 md:row-start-1"
      >
        <MagicCard beamDuration={7}>
          {overview ? (
            <HeroContent
              overview={overview}
              accentColor={accentColor}
              artists={artists}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ) : (
            <HeroContent
              overview={null}
              artists={artists}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.08}
        className="row-span-1 md:col-span-1 md:col-start-3 md:row-start-1 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[100px]" />
        ) : (
          <MagicCard>
            <KpiCard label="Écoutes" value={overview!.total_plays} icon={<Music2 className="w-3.5 h-3.5" />} />
          </MagicCard>
        )}
      </BlurFade>

      <BlurFade
        delay={0.1}
        className="row-span-1 md:col-span-1 md:col-start-4 md:row-start-1 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[100px]" />
        ) : (
          <MagicCard>
            <KpiCard label="Durée" value={formatDurationHours(overview!.total_duration).value} suffix={formatDurationHours(overview!.total_duration).unit} icon={<Calendar className="w-3.5 h-3.5" />} />
          </MagicCard>
        )}
      </BlurFade>

      <BlurFade
        delay={0.11}
        className="row-span-1 md:col-span-1 md:col-start-5 md:row-start-1 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[100px]" />
        ) : (
          <MagicCard>
            <KpiCard label="Titres" value={overview!.unique_tracks} icon={<Disc3 className="w-3.5 h-3.5" />} />
          </MagicCard>
        )}
      </BlurFade>

      <BlurFade
        delay={0.12}
        className="row-span-1 md:col-span-1 md:col-start-6 md:row-start-1 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[100px]" />
        ) : (
          <MagicCard beamDuration={6}>
            <StreakCard streak={computeWeeklyStreak(data!.calendar)} />
          </MagicCard>
        )}
      </BlurFade>

      {/* Row 2: Evolution chart (6) */}
      <BlurFade
        delay={0.15}
        className="row-span-1 md:col-span-6 md:col-start-1 md:row-start-2 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[160px]" />
        ) : (
          <MagicCard>
            <ArtistListeningChart data={chartData} accentColor={accentColor} />
          </MagicCard>
        )}
      </BlurFade>

      {/* Row 3: Heatmap (2) + Listening Rhythm (2) + Top Albums (2) */}
      <BlurFade
        delay={0.18}
        className="row-span-1 md:col-span-2 md:col-start-1 md:row-start-3 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[140px]" />
        ) : (
          <MagicCard beamDuration={7}>
            <ArtistHeatmap data={heatmapData} accentColor={accentColor} />
          </MagicCard>
        )}
      </BlurFade>

      <BlurFade
        delay={0.22}
        className="row-span-1 md:col-span-2 md:col-start-1 md:row-start-4 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[140px]" />
        ) : (
          <MagicCard>
            <ListeningRhythmCard heatmap={data!.heatmap} accentColor={accentColor} />
          </MagicCard>
        )}
      </BlurFade>

      <BlurFade
        delay={0.26}
        className="row-span-2 md:col-span-2 md:col-start-5 md:row-start-3 md:row-span-2"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[140px]" />
        ) : (
          <MagicCard>
            <TopAlbumsContent albums={data!.albums} accentColor={accentColor} />
          </MagicCard>
        )}
      </BlurFade>

      {/* Row 4: Top Tracks (2) sous les heatmaps */}
      <BlurFade
        delay={0.28}
        className="row-span-2 md:col-span-2 md:col-start-3 md:row-start-3 md:row-span-2"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[140px]" />
        ) : (
          <MagicCard>
            <TopTracksContent tracks={data!.top_tracks} accentColor={accentColor} />
          </MagicCard>
        )}
      </BlurFade>

      {/* Row 5: Albums Mosaic full width */}
      <BlurFade
        delay={0.3}
        className="row-span-1 md:col-span-6 md:col-start-1 md:row-start-5 md:row-span-1"
      >
        {showSkeleton ? (
          <SkeletonBlock className="h-full min-h-[160px]" />
        ) : (
          <MagicCard>
            <AlbumsMosaic albums={data!.albums} />
          </MagicCard>
        )}
      </BlurFade>

    </BentoGrid>
  );
}
