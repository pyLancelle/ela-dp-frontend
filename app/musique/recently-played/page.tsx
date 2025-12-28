"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Music, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { DateRangeFilter, DateFilterPreset } from "@/components/date-range-filter";
import { TimeRangePicker } from "@/components/music/time-range-picker";
import { ArtistSearch } from "@/components/music/artist-search";
import { Pagination } from "@/components/music/pagination";
import { DateRange } from "react-day-picker";
import { useRecentlyPlayed } from "@/hooks/queries";
import { useDebounce } from "@/hooks/use-debounce";

// Fonctions utilitaires
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getImageUrl(url: string | null): string {
  if (!url) {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" fill="%23374151"/%3E%3Cpath d="M24 14a8 8 0 100 16 8 8 0 000-16zm-2 8a2 2 0 114 0 2 2 0 01-4 0z" fill="%239ca3af"/%3E%3C/svg%3E';
  }
  return url;
}

export default function RecentlyPlayedPage() {
  // Filtres
  const [selectedPreset, setSelectedPreset] = useState<DateFilterPreset>("allTime");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [timeFrom, setTimeFrom] = useState<string | undefined>();
  const [timeTo, setTimeTo] = useState<string | undefined>();
  const [artistSearch, setArtistSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce la recherche artiste pour éviter les requêtes à chaque frappe
  const debouncedArtist = useDebounce(artistSearch, 400);

  // Construire les filtres pour le hook
  const filters = useMemo(() => ({
    page: currentPage,
    pageSize: 50,
    dateFrom: dateRange?.from?.toISOString().split('T')[0],
    dateTo: dateRange?.to?.toISOString().split('T')[0],
    timeFrom,
    timeTo,
    artist: debouncedArtist || undefined,
  }), [currentPage, dateRange, timeFrom, timeTo, debouncedArtist]);

  // Utiliser le hook React Query
  const { data, isLoading, isFetching, isError, error } = useRecentlyPlayed(filters);

  const tracks = data?.tracks ?? [];
  const artists = data?.artists ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
  };

  // Handlers
  const handleFilterChange = (preset: DateFilterPreset, range?: DateRange) => {
    setSelectedPreset(preset);
    setDateRange(range);
    setCurrentPage(1); // Reset à la page 1 quand les filtres changent
  };

  const handleTimeChange = (from: string | undefined, to: string | undefined) => {
    setTimeFrom(from);
    setTimeTo(to);
    setCurrentPage(1);
  };

  const handleArtistChange = (value: string) => {
    setArtistSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedPreset("allTime");
    setDateRange(undefined);
    setTimeFrom(undefined);
    setTimeTo(undefined);
    setArtistSearch("");
    setCurrentPage(1);
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = selectedPreset !== "allTime" || timeFrom || timeTo || artistSearch;

  // Loading state initial (pas de données en cache)
  if (isLoading && !data) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Chargement des titres...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Music className="h-8 w-8" />
          Derniers titres joués
        </h1>
        <p className="text-muted-foreground">
          Historique de vos écoutes Spotify
        </p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Ligne 1: Filtres de date */}
            <DateRangeFilter
              selectedPreset={selectedPreset}
              onFilterChange={handleFilterChange}
            />

            {/* Ligne 2: Filtre horaire + Recherche artiste */}
            <div className="flex flex-wrap items-center gap-4">
              <TimeRangePicker
                timeFrom={timeFrom}
                timeTo={timeTo}
                onTimeChange={handleTimeChange}
              />

              <div className="flex-1 min-w-[250px] max-w-[400px]">
                <ArtistSearch
                  value={artistSearch}
                  artists={artists}
                  onChange={handleArtistChange}
                />
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Erreur */}
      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error instanceof Error ? error.message : 'Une erreur est survenue'}</p>
        </div>
      )}

      {/* Tableau */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              Historique
              {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {pagination.totalItems} titre{pagination.totalItems > 1 ? 's' : ''}
              </Badge>
              {pagination.totalPages > 0 && (
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-[100px] p-2 bg-background">Date</TableHead>
                  <TableHead className="w-[80px] p-2 bg-background">Heure</TableHead>
                  <TableHead className="w-[48px] p-2 bg-background"></TableHead>
                  <TableHead className="p-2 min-w-[200px] bg-background">Titre</TableHead>
                  <TableHead className="p-2 min-w-[150px] bg-background">Artiste</TableHead>
                  <TableHead className="text-right p-2 w-[80px] bg-background">Durée</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tracks.length > 0 ? (
                  tracks.map((track) => (
                    <TableRow
                      key={`${track.id}-${track.played_at}`}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => window.open(track.track.external_url, '_blank')}
                    >
                      <TableCell className="p-2 text-sm">
                        {formatDate(track.played_at)}
                      </TableCell>
                      <TableCell className="p-2 text-sm text-muted-foreground">
                        {formatTime(track.played_at)}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="w-10 h-10 relative overflow-hidden rounded">
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
                        <div className="flex items-center gap-2">
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-sm font-medium truncate"
                              title={track.track.name}
                            >
                              {truncateText(track.track.name, 40)}
                            </div>
                            <div
                              className="text-xs text-muted-foreground truncate"
                              title={track.album.name}
                            >
                              {truncateText(track.album.name, 40)}
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </TableCell>
                      <TableCell className="p-2 text-sm">
                        {track.artist.name}
                      </TableCell>
                      <TableCell className="text-right p-2 text-sm font-medium">
                        {formatDuration(track.track.duration_ms)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Music className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Aucun titre trouvé pour les filtres sélectionnés
                        </p>
                        {hasActiveFilters && (
                          <Button variant="link" size="sm" onClick={handleResetFilters}>
                            Réinitialiser les filtres
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Affichage de {(pagination.page - 1) * pagination.pageSize + 1} à{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} sur{' '}
                {pagination.totalItems} titres
              </p>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
