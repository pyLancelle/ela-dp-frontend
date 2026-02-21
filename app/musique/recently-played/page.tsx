"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Music, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Pagination } from "@/components/music/pagination";
import { useRecentlyPlayed } from "@/hooks/queries";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("fr-FR", {
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "…";
}

function getImageUrl(url: string | null): string {
  if (!url) return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" fill="%23374151"/%3E%3Cpath d="M24 14a8 8 0 100 16 8 8 0 000-16zm-2 8a2 2 0 114 0 2 2 0 01-4 0z" fill="%239ca3af"/%3E%3C/svg%3E';
  return url;
}

export default function RecentlyPlayedPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useMemo(() => ({
    page: currentPage,
    pageSize: 20,
  }), [currentPage]);

  const { data, isLoading, isFetching, isError, error } = useRecentlyPlayed(filters);

  const tracks = data?.tracks ?? [];
  const pagination = data?.pagination ?? { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading && !data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Chargement des titres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* Erreur */}
      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm">
          <p className="font-semibold">Erreur</p>
          <p>{error instanceof Error ? error.message : "Une erreur est survenue"}</p>
        </div>
      )}

      {/* Tableau */}
      <BlurFade delay={0.05} duration={0.5} className="flex-1 min-h-0 flex flex-col">
        <div className="liquid-glass-card rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
          {/* Header tableau */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Historique</span>
              {isFetching && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground tabular-nums">
                {pagination.totalItems} titre{pagination.totalItems > 1 ? "s" : ""}
              </span>
              {pagination.totalPages > 0 && (
                <span className="text-xs text-muted-foreground">
                  p. {pagination.page}/{pagination.totalPages}
                </span>
              )}
            </div>
          </div>

          <div className="relative overflow-auto flex-1 min-h-0">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-white/10 bg-background/60 backdrop-blur-sm">
                  <TableHead className="w-[100px] p-2 text-xs">Date</TableHead>
                  <TableHead className="w-[70px] p-2 text-xs">Heure</TableHead>
                  <TableHead className="w-[44px] p-2"></TableHead>
                  <TableHead className="p-2 min-w-[200px] text-xs">Titre</TableHead>
                  <TableHead className="p-2 min-w-[140px] text-xs">Artiste</TableHead>
                  <TableHead className="text-right p-2 w-[72px] text-xs">Durée</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.length > 0 ? (
                  tracks.map((track) => (
                    <TableRow
                      key={`${track.id}-${track.played_at}`}
                      className="hover:bg-white/5 cursor-pointer border-white/8 transition-colors"
                      onClick={() => window.open(track.track.external_url, "_blank")}
                    >
                      <TableCell className="p-2 text-xs text-muted-foreground tabular-nums">
                        {formatDate(track.played_at)}
                      </TableCell>
                      <TableCell className="p-2 text-xs text-muted-foreground tabular-nums">
                        {formatTime(track.played_at)}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="w-9 h-9 relative overflow-hidden rounded-md flex-shrink-0">
                          <Image
                            src={getImageUrl(track.album.image_url)}
                            alt={track.album.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate" title={track.track.name}>
                              {truncateText(track.track.name, 42)}
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate" title={track.album.name}>
                              {truncateText(track.album.name, 42)}
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
                        </div>
                      </TableCell>
                      <TableCell className="p-2 text-xs">{track.artist.name}</TableCell>
                      <TableCell className="text-right p-2 text-xs font-medium tabular-nums">
                        {formatDuration(track.track.duration_ms)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Music className="h-7 w-7 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Aucun titre trouvé</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-4 py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
              <p className="text-xs text-muted-foreground">
                {(pagination.page - 1) * pagination.pageSize + 1}–
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} sur{" "}
                {pagination.totalItems} titres
              </p>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </BlurFade>
    </div>
  );
}
