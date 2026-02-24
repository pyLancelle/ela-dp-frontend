"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { KilometerLap } from "@/types/activity";
import type { ActivityInterval } from "@/types/activity-detail";
import type { TrackPlayed } from "@/components/activity/activity-tracks-card";
import { metersToKm, formatDuration, formatPace, msToPaceMinPerKm } from "@/types/activity";
import { Ruler, Zap, Music } from "lucide-react";

interface IntervalsListCardProps {
  kmLaps?: KilometerLap[] | null;
  intervals?: ActivityInterval[] | null;
  tracks?: TrackPlayed[] | null;
}

const INTERVAL_TYPE_COLORS: Record<string, string> = {
  warmup:   "#38bdf8",
  work:     "#fb923c",
  recovery: "#4ade80",
  cooldown: "#a78bfa",
  rest:     "#64748b",
};

function formatPaceFromMinKm(pace: number) {
  if (!pace || pace <= 0) return "—";
  const min = Math.floor(pace);
  const sec = Math.round((pace - min) * 60);
  return `${min}'${String(sec).padStart(2, "0")}"`;
}

function formatTrackDuration(ms: number | null): string {
  if (!ms) return "-";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatPlayedAt(playedAt: { value: string } | string | null): string {
  const raw = typeof playedAt === "string" ? playedAt : playedAt?.value;
  if (!raw) return "-";
  return new Date(raw).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function getImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23374151"%2F%3E%3C/svg%3E';
  return url;
}

const MODES = ["km", "interval", "music"] as const;
type Mode = typeof MODES[number];

export function IntervalsListCard({ kmLaps, intervals, tracks }: IntervalsListCardProps) {
  const [mode, setMode] = useState<Mode>("km");
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const idx = MODES.indexOf(mode);
    const btn = btnRefs.current[idx];
    if (btn) {
      setSliderStyle({ left: btn.offsetLeft, width: btn.offsetWidth });
    }
  }, [mode]);

  const hasKm = (kmLaps?.length ?? 0) > 0;
  const hasIntervals = (intervals?.length ?? 0) > 0;
  const hasTracks = (tracks?.length ?? 0) > 0;
  const showKm = mode === "km" && hasKm;
  const showIntervals = mode === "interval" && hasIntervals;
  const showMusic = mode === "music";

  return (
    <div className="liquid-glass-card rounded-2xl h-full flex flex-col overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent flex-shrink-0" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            {mode === "km" ? "Splits au kilomètre" : mode === "interval" ? "Intervalles d'entraînement" : "Musique"}
          </span>
        </div>

        {/* Toggle avec slider animé */}
        <div
          className="relative flex items-center rounded-full p-0.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {/* Pill glissante */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: sliderStyle.left,
              width: sliderStyle.width,
              height: "calc(100% - 4px)",
              top: 2,
              background: "rgba(255,255,255,0.12)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "left 0.2s cubic-bezier(0.4,0,0.2,1), width 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
          {([
            { key: "km",       Icon: Ruler, label: "km"       },
            { key: "interval", Icon: Zap,   label: "Intervals" },
            { key: "music",    Icon: Music,  label: "Musique"  },
          ] as { key: Mode; Icon: React.ElementType; label: string }[]).map(({ key, Icon, label }, idx) => (
            <button
              key={key}
              ref={(el) => { btnRefs.current[idx] = el; }}
              onClick={() => setMode(key)}
              className="relative flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors duration-150 cursor-pointer z-10"
              style={{ color: mode === key ? "white" : "rgba(255,255,255,0.35)" }}
            >
              <Icon style={{ width: 9, height: 9 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden px-2 pb-2 min-h-0">
        {(!showKm && !showIntervals && !showMusic) ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
          </div>
        ) : showMusic ? (
          <div className="relative overflow-auto h-full rounded-xl" style={{ background: "rgba(0,0,0,0.06)" }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10" style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
              }}>
                <tr>
                  <th className="text-left pl-4 pr-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Heure</th>
                  <th className="text-left p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Titre</th>
                  <th className="text-right pl-2 pr-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Durée</th>
                </tr>
              </thead>
              <tbody>
                {hasTracks ? tracks!.map((track, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.07)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)"; }}
                  >
                    <td className="pl-4 pr-2 py-2 text-muted-foreground whitespace-nowrap">{formatPlayedAt(track.played_at)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <a href={track.track_url || "#"} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 block w-7 h-7 relative overflow-hidden rounded ring-1 ring-white/10 hover:opacity-80 transition-opacity">
                          <Image src={getImageUrl(track.album_image)} alt={track.track_name || ""} fill className="object-cover" />
                        </a>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{track.track_name}</div>
                          <div className="text-muted-foreground truncate text-[10px]">{track.artists}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right pl-2 pr-4 py-2 whitespace-nowrap font-medium">{formatTrackDuration(track.duration_ms)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-center py-8 text-muted-foreground">Aucun titre enregistré</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative overflow-auto h-full rounded-xl" style={{ background: "rgba(0,0,0,0.06)" }}>
            <table className="w-full text-xs">
              <thead className="sticky top-0 z-10" style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
              }}>
                {showKm ? (
                  <tr>
                    <th className="text-left pl-4 pr-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Km</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Distance</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Temps</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Allure</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">FC moy</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">FC max</th>
                    <th className="text-right pl-2 pr-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">D+</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="text-left pl-4 pr-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">#</th>
                    <th className="text-left p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Type</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Distance</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Temps</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Allure</th>
                    <th className="text-right p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">FC moy</th>
                    <th className="text-right pl-2 pr-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">D+</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {showKm && kmLaps!.map((lap, i) => {
                  const pace = msToPaceMinPerKm(lap.averageSpeed);
                  return (
                    <tr
                      key={lap.lapIndex}
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.07)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)"; }}
                    >
                      <td className="font-bold pl-4 pr-2 py-1.5">{lap.lapIndex}</td>
                      <td className="text-right p-1.5 text-muted-foreground">{metersToKm(lap.distance).toFixed(2)} km</td>
                      <td className="text-right p-1.5 font-medium">{formatDuration(lap.duration)}</td>
                      <td className="text-right p-1.5">{formatPace(pace)}/km</td>
                      <td className="text-right p-1.5">{Math.round(lap.averageHR)}</td>
                      <td className="text-right p-1.5">{Math.round(lap.maxHR)}</td>
                      <td className="text-right pl-1.5 pr-4 py-1.5 font-medium">{lap.elevationGain}m</td>
                    </tr>
                  );
                })}

                {showIntervals && intervals!.map((interval, i) => {
                  const color = INTERVAL_TYPE_COLORS[interval.type] ?? "#94a3b8";
                  return (
                    <tr
                      key={interval.id}
                      style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.07)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)"; }}
                    >
                      <td className="font-bold pl-4 pr-2 py-1.5 text-muted-foreground">{interval.id}</td>
                      <td className="p-1.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                          style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
                        >
                          {interval.name}
                        </span>
                      </td>
                      <td className="text-right p-1.5 text-muted-foreground">{interval.distance.toFixed(2)} km</td>
                      <td className="text-right p-1.5 font-medium">{formatDuration(interval.duration)}</td>
                      <td className="text-right p-1.5">{formatPaceFromMinKm(interval.avgPace)}/km</td>
                      <td className="text-right p-1.5">{Math.round(interval.avgHeartRate)}</td>
                      <td className="text-right pl-1.5 pr-4 py-1.5 font-medium">{interval.elevationGain}m</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
