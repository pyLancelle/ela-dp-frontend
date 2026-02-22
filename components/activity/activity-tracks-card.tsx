"use client";

import { Music } from "lucide-react";
import Image from "next/image";

export interface TrackPlayed {
  played_at: { value: string } | string | null;
  track_name: string | null;
  artists: string | null;
  album_name: string | null;
  album_image: string | null;
  duration_ms: number | null;
  track_url: string | null;
}

interface ActivityTracksCardProps {
  tracks: TrackPlayed[];
}

function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl || imageUrl.trim() === "") {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23e5e7eb"%2F%3E%3Cpath d="M16 10a3 3 0 100 6 3 3 0 000-6zm-5 12a2 2 0 012-2h6a2 2 0 012 2v2H11v-2z" fill="%239ca3af"%2F%3E%3C/svg%3E';
  }
  return imageUrl;
}

function formatDuration(durationMs: number | null): string {
  if (!durationMs) return "-";
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatPlayedAt(playedAt: { value: string } | string | null): string {
  const raw = typeof playedAt === "string" ? playedAt : playedAt?.value;
  if (!raw) return "-";
  return new Date(raw).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function ActivityTracksCard({ tracks }: ActivityTracksCardProps) {
  return (
    <div className="liquid-glass-card rounded-2xl h-full flex flex-col overflow-hidden">
      {/* Shimmer top */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-2 flex-shrink-0">
        <div className="p-1.5 rounded-lg bg-purple-500/20 ring-1 ring-purple-400/30">
          <Music className="h-4 w-4 text-purple-400" />
        </div>
        <span className="text-sm font-semibold tracking-tight">
          Titres écoutés pendant l'activité
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden px-2 pb-2">
        <div className="overflow-auto h-full rounded-xl" style={{ background: "rgba(0,0,0,0.06)" }}>
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10" style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
            }}>
              <tr>
                <th className="text-left pl-4 pr-2 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Heure
                </th>
                <th className="text-left p-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px] min-w-[200px]">
                  Titre
                </th>
                <th className="text-right pl-2 pr-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Durée
                </th>
              </tr>
            </thead>
            <tbody>
              {tracks.length > 0 ? (
                tracks.map((track, index) => (
                  <tr
                    key={index}
                    className="transition-colors duration-150"
                    style={{
                      background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.025)";
                    }}
                  >
                    <td className="pl-4 pr-2 py-2 text-muted-foreground whitespace-nowrap">
                      {formatPlayedAt(track.played_at)}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <a
                          href={track.track_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 hover:opacity-80 transition-opacity block w-8 h-8 relative overflow-hidden rounded-lg ring-1 ring-white/10"
                        >
                          <Image
                            src={getImageUrl(track.album_image)}
                            alt={track.track_name || "Album cover"}
                            fill
                            className="object-cover"
                          />
                        </a>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" title={track.track_name || ""}>
                            {truncateText(track.track_name, 40)}
                          </div>
                          <div className="text-muted-foreground truncate" title={track.artists || ""}>
                            {truncateText(track.artists, 40)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right pl-2 pr-4 py-2 whitespace-nowrap font-medium">
                      {formatDuration(track.duration_ms)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Aucun titre écouté enregistré pour cette activité
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
