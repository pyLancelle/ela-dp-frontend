"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/magicui/bento-grid";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ArtistHeatmap } from "@/components/music/artist/ArtistHeatmap";
import { ArtistListeningChart } from "@/components/music/artist/ArtistListeningChart";
import { ArtistSelector } from "@/components/music/artist/ArtistSelector";
import { useArtistFocusList, useArtistFocus } from "@/hooks/queries";
import {
  ExternalLink,
  Music2,
  Flame,
  Calendar,
  BarChart3,
  Disc3,
  Loader2,
  Clock,
} from "lucide-react";
import type {
  ArtistOverview,
  ArtistTopTrack,
  ArtistCalendarDay,
  ArtistEvolution,
  ArtistHeatmapEntry,
  ArtistAlbum,
} from "@/types/artist-focus";

// ── Data transformers ────────────────────────────────────────────────────────

function calendarToHeatmap(calendar: ArtistCalendarDay[]) {
  return calendar.map((d) => ({
    date: d.listen_date,
    minutes: Math.round(d.total_duration_ms / 60000),
  }));
}

function evolutionToChart(evolution: ArtistEvolution[]) {
  const MONTH_SHORT: Record<string, string> = {
    "01": "Jan", "02": "Fév", "03": "Mar", "04": "Avr",
    "05": "Mai", "06": "Jun", "07": "Jul", "08": "Aoû",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Déc",
  };
  return evolution.map((e) => {
    const [year, month] = e.year_month.split("-");
    return {
      month: `${MONTH_SHORT[month]} ${year.slice(2)}`,
      plays: e.play_count,
      minutes: Math.round(e.total_duration_ms / 60000),
    };
  });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Hero Card ────────────────────────────────────────────────────────────────

function HeroContent({ overview }: { overview: ArtistOverview }) {
  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full relative">
      {overview.image_url && (
        <div className="absolute inset-0 z-0">
          <img
            src={overview.image_url}
            alt=""
            className="w-full h-full object-cover scale-110 blur-2xl opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      )}

      <div className="relative z-10 flex flex-col justify-between h-full p-5">
        <div className="flex items-start gap-4">
          {overview.image_url ? (
            <img
              src={overview.image_url}
              alt={overview.artist_name}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-white/20 shadow-lg flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Music2 className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-white/90 leading-tight mb-1.5">
              {overview.artist_name}
            </h1>
            {overview.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {overview.genres.map((g) => (
                  <Badge
                    key={g}
                    variant="outline"
                    className="text-[10px] border-white/15 text-white/50 bg-white/5 backdrop-blur-sm"
                  >
                    {g}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-white/50">
              Découvert le {formatDate(overview.first_heard)}
            </p>
          </div>
        </div>

        <a
          href={overview.artist_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1DB954] hover:bg-[#1DB954]/30 transition-colors backdrop-blur-sm w-fit"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Ouvrir dans Spotify
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
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

function OverviewStats({ overview }: { overview: ArtistOverview }) {
  const duration = formatDurationHours(overview.total_duration);
  return (
    <div className="liquid-glass-card rounded-xl px-3 pt-3 pb-2 h-full grid grid-cols-2 grid-rows-2 gap-1">
      <StatCell label="Écoutes" value={overview.total_plays} icon={<Music2 className="w-3.5 h-3.5" />} />
      <StatCell label="Durée" value={duration.value} suffix={duration.unit} icon={<Calendar className="w-3.5 h-3.5" />} />
      <StatCell label="Titres" value={overview.unique_tracks} icon={<Disc3 className="w-3.5 h-3.5" />} />
      <StatCell label="Albums" value={overview.unique_albums} icon={<Disc3 className="w-3.5 h-3.5" />} />
    </div>
  );
}

function StatCell({
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
    <div className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-white/[0.03] py-1.5">
      <span className="text-muted-foreground/30">{icon}</span>
      <div className="flex items-baseline gap-0.5">
        <NumberTicker
          value={value}
          className="text-xl font-black tabular-nums leading-none"
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
          {streak === 1 ? "jour de streak" : "jours de streak"}
        </span>
      </div>
    </div>
  );
}

// ── Listening Rhythm (hour × day_of_week) ────────────────────────────────

const RHYTHM_DAY_LABELS = ["L", "M", "M", "J", "V", "S", "D"];

function ListeningRhythmCard({ heatmap }: { heatmap: ArtistHeatmapEntry[] }) {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const entry of heatmap) {
    const dayIdx = (entry.day_of_week + 6) % 7; // 1=Mon→0, 7=Sun→6
    grid[dayIdx][entry.hour_of_day] = Math.round(entry.total_duration_ms / 60000);
  }
  const max = Math.max(...grid.flat(), 1);

  function getColor(minutes: number): string {
    if (minutes === 0) return "bg-white/5";
    const ratio = minutes / max;
    if (ratio < 0.15) return "bg-purple-900/60";
    if (ratio < 0.4) return "bg-purple-700/70";
    if (ratio < 0.7) return "bg-purple-500/80";
    return "bg-purple-300/90";
  }

  return (
    <div className="liquid-glass-card rounded-xl overflow-hidden h-full flex flex-col px-3 pt-2 pb-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Rythme d'écoute
        </p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        <div
          className="grid flex-1 min-h-0 w-full"
          style={{
            gridTemplateColumns: "auto repeat(24, 1fr)",
            gridTemplateRows: "repeat(7, 1fr) auto",
            gap: "2px",
          }}
        >
          {grid.map((dayRow, dayIdx) => (
            <>
              {/* Day label */}
              <div
                key={`label-${dayIdx}`}
                className="flex items-center justify-end pr-1.5"
              >
                <span className="text-[7px] text-muted-foreground/60 leading-none">
                  {RHYTHM_DAY_LABELS[dayIdx]}
                </span>
              </div>
              {/* Hour cells */}
              {dayRow.map((minutes, hour) => (
                <div
                  key={`${dayIdx}-${hour}`}
                  className={`rounded-[2px] ${getColor(minutes)}`}
                  title={`${RHYTHM_DAY_LABELS[dayIdx]} ${hour}h — ${minutes} min`}
                />
              ))}
            </>
          ))}
          {/* Hour labels row */}
          <div />
          {Array.from({ length: 24 }, (_, h) => (
            <div key={`h-${h}`} className="flex items-start justify-center">
              {h % 6 === 0 && (
                <span className="text-[7px] text-muted-foreground/50">{h}h</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Albums Card ──────────────────────────────────────────────────────────

const DEPTH_BADGE: Record<string, { label: string; class: string }> = {
  complete: { label: "Complet", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  partial: { label: "Partiel", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  shallow: { label: "Effleuré", class: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30" },
};

function AlbumsCard({ albums }: { albums: ArtistAlbum[] }) {
  const realAlbums = albums.filter(
    (a) => a.album_type === "album" || a.total_tracks >= 7
  );
  const sorted = [...realAlbums].sort((a, b) => b.release_date.localeCompare(a.release_date));
  return (
    <div className="liquid-glass-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Disc3 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Albums
        </p>
        <span className="ml-auto text-[10px] text-muted-foreground/40 tabular-nums">
          {realAlbums.length} albums
        </span>
      </div>
      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        {sorted.map((album) => {
          const badge = DEPTH_BADGE[album.listen_depth] ?? DEPTH_BADGE.shallow;
          return (
            <a
              key={album.album_id}
              href={album.album_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {album.album_image_url ? (
                <img
                  src={album.album_image_url}
                  alt=""
                  className="w-9 h-9 rounded-md object-cover flex-shrink-0 border border-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Disc3 className="w-4 h-4 text-muted-foreground/60" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{album.album_name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {album.tracks_heard}/{album.total_tracks} titres
                  </span>
                  <div className="w-12 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-cyan-500/60"
                      style={{ width: `${Math.round(album.completion_rate * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[8px] px-1.5 py-0 h-4 flex-shrink-0 ${badge.class}`}
              >
                {badge.label}
              </Badge>
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

  return (
    <div className="liquid-glass-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Disc3 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Discographie
        </p>
        <span className="ml-auto text-[10px] text-muted-foreground/40 tabular-nums">
          {realAlbums.length} albums
        </span>
      </div>
      <div className="flex gap-4 flex-1 overflow-x-auto pb-2">
        {sorted.map((album) => {
          const pct = Math.round(album.completion_rate * 100);
          const badge = DEPTH_BADGE[album.listen_depth] ?? DEPTH_BADGE.shallow;
          return (
            <a
              key={album.album_id}
              href={album.album_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1.5 flex-shrink-0 w-28"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                {album.album_image_url ? (
                  <img
                    src={album.album_image_url}
                    alt={album.album_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <Disc3 className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
                {/* Completion overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                  <div
                    className="h-full bg-cyan-400/80"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium truncate leading-tight">
                  {album.album_name}
                </p>
                <p className="text-[10px] text-muted-foreground/60 truncate">
                  {album.artist_names}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-muted-foreground/40 tabular-nums">
                    {album.tracks_heard}/{album.total_tracks}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[7px] px-1 py-0 h-3.5 ${badge.class}`}
                  >
                    {badge.label}
                  </Badge>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ── Top Tracks ───────────────────────────────────────────────────────────────

function TopTracksContent({ tracks }: { tracks: ArtistTopTrack[] }) {
  const maxPlays = tracks[0]?.play_count ?? 1;
  return (
    <div className="liquid-glass-card rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Music2 className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Top Titres
        </p>
      </div>
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
                className="absolute left-0 top-0 h-full rounded-lg bg-cyan-500/5"
                style={{ width: `${widthPct}%` }}
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

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Chargement des données...</p>
      </div>
    </div>
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
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const { data: indexData, isLoading: isLoadingList } = useArtistFocusList();
  const {
    data: detailData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
  } = useArtistFocus(selectedArtistId);

  const artists = indexData?.artists ?? [];

  // Auto-select first artist when list loads
  if (artists.length > 0 && selectedArtistId === null) {
    setSelectedArtistId(artists[0].artist_id);
  }

  return (
    <div className="px-6 pt-1 pb-2 min-h-[calc(100vh-8rem)]">
      {/* Selector */}
      <BlurFade delay={0.05} duration={0.5}>
        <div className="flex items-center gap-3 mb-4">
          <ArtistSelector
            artists={artists}
            selectedId={selectedArtistId}
            onSelect={setSelectedArtistId}
            isLoading={isLoadingList}
          />
          {isFetchingDetail && selectedArtistId && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </BlurFade>

      {/* Content */}
      {!selectedArtistId ? (
        <EmptyState />
      ) : isLoadingDetail ? (
        <LoadingSkeleton />
      ) : detailData ? (
        <ArtistContent data={detailData} />
      ) : null}
    </div>
  );
}

function ArtistContent({
  data,
}: {
  data: import("@/types/artist-focus").ArtistFocusDetailResponse;
}) {
  const { overview, top_tracks, albums, calendar, heatmap, evolution } = data;

  const heatmapData = calendarToHeatmap(calendar);
  const chartData = evolutionToChart(evolution);

  return (
    <BentoGrid>
      {/* Row 1: Hero (4) + Stats (1) + Streak (1) */}
      <BlurFade
        delay={0.05}
        className="md:col-span-4 md:row-span-1 md:col-start-1 md:row-start-1"
      >
        <MagicCard beamDuration={7}>
          <HeroContent overview={overview} />
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.1}
        className="md:col-span-1 md:col-start-5 md:row-start-1 md:row-span-1"
      >
        <MagicCard>
          <OverviewStats overview={overview} />
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.12}
        className="md:col-span-1 md:col-start-6 md:row-start-1 md:row-span-1"
      >
        <MagicCard beamDuration={6}>
          <StreakCard streak={overview.current_streak} />
        </MagicCard>
      </BlurFade>

      {/* Row 2: Heatmap calendar (3) + Evolution chart (3) */}
      <BlurFade
        delay={0.15}
        className="md:col-span-3 md:col-start-1 md:row-start-2 md:row-span-1"
      >
        <MagicCard beamDuration={7}>
          <ArtistHeatmap data={heatmapData} />
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.2}
        className="md:col-span-3 md:col-start-4 md:row-start-2 md:row-span-1"
      >
        <MagicCard>
          <ArtistListeningChart data={chartData} />
        </MagicCard>
      </BlurFade>

      {/* Row 3: Listening Rhythm (2) + Albums (2) + Top Tracks (2) */}
      <BlurFade
        delay={0.22}
        className="md:col-span-2 md:col-start-1 md:row-start-3 md:row-span-1"
      >
        <MagicCard>
          <ListeningRhythmCard heatmap={heatmap} />
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.26}
        className="md:col-span-2 md:col-start-3 md:row-start-3 md:row-span-2"
      >
        <MagicCard>
          <AlbumsCard albums={albums} />
        </MagicCard>
      </BlurFade>

      <BlurFade
        delay={0.28}
        className="md:col-span-2 md:col-start-5 md:row-start-3 md:row-span-2"
      >
        <MagicCard>
          <TopTracksContent tracks={top_tracks} />
        </MagicCard>
      </BlurFade>

      {/* Row 5: Albums Mosaic full width */}
      <BlurFade
        delay={0.3}
        className="md:col-span-6 md:col-start-1 md:row-start-5 md:row-span-2"
      >
        <MagicCard>
          <AlbumsMosaic albums={albums} />
        </MagicCard>
      </BlurFade>

    </BentoGrid>
  );
}
