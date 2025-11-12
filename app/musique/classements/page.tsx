"use client";

import { useEffect, useState } from "react";
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

// Interface pour les données BigQuery
interface TopTrack {
  rank: number;
  trackname: string;
  all_artist_names: string;
  total_duration: string;
  play_count: number;
  trackExternalUrl: string;
  albumimageurl: string;
}

interface TopArtist {
  rank: number;
  artistname: string;
  total_duration: string;
  play_count: number;
  track_count: number;
  albumimageurl: string;
  artistexternalurl: string;
  tracks?: {
    trackname: string;
    duration: string;
    play_count: number;
    percentage: number;
  }[];
}

interface TopAlbum {
  rank: number;
  albumname: string;
  all_artist_names: string;
  total_duration: string;
  play_count: number;
  track_count: number;
  albumimageurl: string;
  albumexternalurl: string;
}

interface ArtistTrackBreakdown {
  trackName: string;
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

// Fonction pour obtenir des données mockées de tracks d'artiste
function getMockedArtistTracks(artistName: string): ArtistTrackBreakdown[] {
  return [];
}

// Fonction pour obtenir l'URL de l'image ou un placeholder
function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23e5e7eb"/%3E%3Cpath d="M16 10a3 3 0 100 6 3 3 0 000-6zm-5 12a2 2 0 012-2h6a2 2 0 012 2v2H11v-2z" fill="%239ca3af"/%3E%3C/svg%3E';
  }
  return imageUrl;
}

export default function ClassementsPage() {
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<TopAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<DateFilterPreset>("allTime");

  // Map frontend presets to BigQuery period values
  const mapPresetToPeriod = (preset: DateFilterPreset): string => {
    switch (preset) {
      case "yesterday":
        return "yesterday";
      case "7days":
        return "last_7_days";
      case "30days":
        return "last_30_days";
      case "thisYear":
        return "last_365_days";
      case "allTime":
        return "all_time";
      case "custom":
        return "all_time"; // Fallback to all_time for custom (not supported yet)
      default:
        return "all_time";
    }
  };

  // State pour le dialog de détails de l'artiste
  const [selectedArtist, setSelectedArtist] = useState<TopArtist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artistTracks, setArtistTracks] = useState<ArtistTrackBreakdown[]>([]);

  const handleArtistClick = (artist: TopArtist) => {
    setSelectedArtist(artist);

    console.log('Artist clicked:', artist);
    console.log('Artist tracks:', artist.tracks);

    // Si l'artiste a des tracks dans les données, on les utilise
    if (artist.tracks && artist.tracks.length > 0) {
      console.log('Using real data from BigQuery');
      const formattedTracks = artist.tracks.map(track => ({
        trackName: track.trackname,
        duration: track.duration,
        playCount: track.play_count,
        percentage: track.percentage,
      }));
      setArtistTracks(formattedTracks);
    } else {
      // Sinon on utilise les données mockées
      console.log('Using mocked data');
      setArtistTracks(getMockedArtistTracks(artist.artistname));
    }

    setIsDialogOpen(true);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Build query parameters
        const period = mapPresetToPeriod(selectedPreset);
        const params = new URLSearchParams();
        params.append('period', period);

        const queryString = params.toString();
        const urlSuffix = queryString ? `?${queryString}` : '';

        const [tracksResponse, artistsResponse, albumsResponse] = await Promise.all([
          fetch(`/api/music/top-tracks${urlSuffix}`),
          fetch(`/api/music/top-artists${urlSuffix}`),
          fetch(`/api/music/top-albums${urlSuffix}`),
        ]);

        if (!tracksResponse.ok || !artistsResponse.ok || !albumsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const tracksData = await tracksResponse.json();
        const artistsData = await artistsResponse.json();
        const albumsData = await albumsResponse.json();

        setTopTracks(tracksData);
        setTopArtists(artistsData);
        setTopAlbums(albumsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    }

    fetchData();
  }, [selectedPreset]);

  const handleFilterChange = (preset: DateFilterPreset, range?: DateRange) => {
    setSelectedPreset(preset);
  };

  // Only show full-page loading on initial load
  if (isInitialLoad && isLoading) {
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
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tableaux côte à côte */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Titres */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Music className="h-4 w-4" />
              Top Titres
              {isLoading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
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
                            className="flex-shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={getImageUrl(track.albumimageurl)}
                              alt={track.trackname}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={track.trackname}>
                              {truncateText(track.trackname, 40)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={track.all_artist_names}>
                              {truncateText(track.all_artist_names, 40)}
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
              {isLoading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
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
                            className="flex-shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={getImageUrl(artist.albumimageurl)}
                              alt={artist.artistname}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={artist.artistname}>
                              {truncateText(artist.artistname, 40)}
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
              {isLoading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
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
                            className="flex-shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={getImageUrl(album.albumimageurl)}
                              alt={album.albumname}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                          </a>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate" title={album.albumname}>
                              {truncateText(album.albumname, 40)}
                            </div>
                            <div className="text-xs text-muted-foreground truncate" title={album.all_artist_names}>
                              {truncateText(album.all_artist_names, 40)}
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
              {selectedArtist?.artistname}
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
                      <h3 className="text-sm font-medium truncate">{track.trackName}</h3>
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
