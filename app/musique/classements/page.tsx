"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Music, User, Loader2, Disc } from "lucide-react";
import Image from "next/image";
import { DateRangeFilter, DateFilterPreset } from "@/components/date-range-filter";
import { DateRange } from "react-day-picker";
import { useMusicClassement, type TopArtist } from "@/hooks/queries";

interface ArtistTrackBreakdown {
  name: string;
  duration: string;
  playCount: number;
  percentage: number;
}

// Fonction pour tronquer le texte avec points de suspension
function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Fonction pour obtenir l'URL de l'image ou un placeholder
function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23e5e7eb"/%3E%3Cpath d="M16 10a3 3 0 100 6 3 3 0 000-6zm-5 12a2 2 0 012-2h6a2 2 0 012 2v2H11v-2z" fill="%239ca3af"/%3E%3C/svg%3E';
  }
  return imageUrl;
}

export default function ClassementsPage() {
  const [selectedPreset, setSelectedPreset] = useState<DateFilterPreset>("allTime");

  // Utiliser le hook React Query
  const { data, isLoading, isFetching, isError, error } = useMusicClassement(selectedPreset);

  const topTracks = data?.top_tracks ?? [];
  const topArtists = data?.top_artists ?? [];
  const topAlbums = data?.top_albums ?? [];

  // State pour le dialog de détails de l'artiste
  const [selectedArtist, setSelectedArtist] = useState<TopArtist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artistTracks, setArtistTracks] = useState<ArtistTrackBreakdown[]>([]);

  const handleArtistClick = (artist: TopArtist) => {
    setSelectedArtist(artist);

    // Si l'artiste a des tracks dans les données, on les utilise
    if (artist.tracks && artist.tracks.length > 0) {
      const formattedTracks = artist.tracks.map(track => ({
        name: track.name,
        duration: track.duration,
        playCount: track.play_count,
        percentage: track.percentage,
      }));
      setArtistTracks(formattedTracks);
    } else {
      setArtistTracks([]);
    }

    setIsDialogOpen(true);
  };

  const handleFilterChange = (preset: DateFilterPreset, range?: DateRange) => {
    setSelectedPreset(preset);
  };

  // Only show full-page loading on initial load (no cached data)
  if (isLoading && !data) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des classements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8" />
          Classements Musicaux
        </h1>
        <p className="text-muted-foreground">
          Découvrez vos titres, artistes et albums les plus écoutés
        </p>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter selectedPreset={selectedPreset} onFilterChange={handleFilterChange} />

      {/* Error display */}
      {isError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      )}

      {/* Tableaux côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Titres */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Music className="h-4 w-4" />
              Top Titres
              {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] p-2">#</TableHead>
                    <TableHead className="p-2 min-w-[200px]">Titre</TableHead>
                    <TableHead className="text-right p-2 w-[100px]">Plays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTracks.map((track) => (
                    <TableRow key={track.rank} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell className="font-bold p-2 text-sm">
                        {track.rank === 1 && "🥇"}
                        {track.rank === 2 && "🥈"}
                        {track.rank === 3 && "🥉"}
                        {track.rank > 3 && track.rank}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <a
                            href={track.trackExternalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 hover:opacity-80 transition-opacity block w-8 h-8 relative overflow-hidden rounded"
                          >
                            <Image
                              src={getImageUrl(track.image_url)}
                              alt={track.name}
                              fill
                              className="object-cover"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={track.name}>
                              {truncateText(track.name, 40)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={track.artist_name}>
                              {truncateText(track.artist_name, 40)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-2 whitespace-nowrap">
                        <div className="text-sm font-medium">{track.total_duration}</div>
                        <div className="text-xs text-muted-foreground">{track.play_count} plays</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Artistes */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-4 w-4" />
              Top Artistes
              {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] p-2">#</TableHead>
                    <TableHead className="p-2 min-w-[200px]">Artiste</TableHead>
                    <TableHead className="text-right p-2 w-[100px]">Plays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topArtists.map((artist) => (
                    <TableRow
                      key={artist.rank}
                      className="hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleArtistClick(artist)}
                    >
                      <TableCell className="font-bold p-2 text-sm">
                        {artist.rank === 1 && "🥇"}
                        {artist.rank === 2 && "🥈"}
                        {artist.rank === 3 && "🥉"}
                        {artist.rank > 3 && artist.rank}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <a
                            href={artist.artistexternalurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 hover:opacity-80 transition-opacity block w-8 h-8 relative overflow-hidden rounded"
                          >
                            <Image
                              src={getImageUrl(artist.image_url)}
                              alt={artist.name}
                              fill
                              className="object-cover"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={artist.name}>
                              {truncateText(artist.name, 40)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-2 whitespace-nowrap">
                        <div className="text-sm font-medium">{artist.total_duration}</div>
                        <div className="text-xs text-muted-foreground">{artist.play_count} plays</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Top Albums */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Disc className="h-4 w-4" />
              Top Albums
              {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] p-2">#</TableHead>
                    <TableHead className="p-2 min-w-[200px]">Album</TableHead>
                    <TableHead className="text-right p-2 w-[100px]">Plays</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAlbums.map((album) => (
                    <TableRow key={album.rank} className="hover:bg-muted/50">
                      <TableCell className="font-bold p-2 text-sm">
                        {album.rank === 1 && "🥇"}
                        {album.rank === 2 && "🥈"}
                        {album.rank === 3 && "🥉"}
                        {album.rank > 3 && album.rank}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <a
                            href={album.albumexternalurl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 hover:opacity-80 transition-opacity block w-8 h-8 relative overflow-hidden rounded"
                          >
                            <Image
                              src={getImageUrl(album.image_url)}
                              alt={album.name}
                              fill
                              className="object-cover"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={album.name}>
                              {truncateText(album.name, 40)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={album.artist_name}>
                              {truncateText(album.artist_name, 40)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right p-2 whitespace-nowrap">
                        <div className="text-sm font-medium">{album.total_duration}</div>
                        <div className="text-xs text-muted-foreground">{album.play_count} plays</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Dialog pour afficher la répartition des chansons */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {selectedArtist?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Répartition du temps d&apos;écoute par chanson • Total: {selectedArtist?.total_duration}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-2">
            {artistTracks.map((track, index) => (
              <div
                key={index}
                className="p-2 rounded border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-bold text-muted-foreground text-xs flex-shrink-0">
                      #{index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{track.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{track.duration}</span>
                        <span>•</span>
                        <span>{track.playCount} plays</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-primary">
                      {track.percentage}%
                    </div>
                  </div>
                </div>
                {/* Barre de progression */}
                <div className="mt-2 w-full bg-muted rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${track.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
