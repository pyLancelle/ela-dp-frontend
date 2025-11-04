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
import { Trophy, Music, User, Loader2, Disc } from "lucide-react";
import Image from "next/image";

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
}

interface TopAlbum {
  rank: number;
  albumname: string;
  all_artist_names: string;
  total_duration: string;
  play_count: number;
  track_count: number;
  albumimageurl: string;
}

// Fonction pour tronquer le texte avec points de suspension
function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function ClassementsPage() {
  const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<TopAlbum[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [tracksResponse, artistsResponse, albumsResponse] = await Promise.all([
          fetch('/api/music/top-tracks'),
          fetch('/api/music/top-artists'),
          fetch('/api/music/top-albums'),
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
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des classements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          <p className="font-semibold">Erreur</p>
          <p>{error}</p>
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

      {/* Tableaux côte à côte */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Titres */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Music className="h-4 w-4" />
              Top Titres
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
                          <Image
                            src={track.albumimageurl}
                            alt={track.trackname}
                            width={32}
                            height={32}
                            className="rounded flex-shrink-0"
                          />
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
                    <TableRow key={artist.rank} className="hover:bg-muted/50">
                      <TableCell className="font-bold p-2 text-sm">
                        {artist.rank === 1 && "🥇"}
                        {artist.rank === 2 && "🥈"}
                        {artist.rank === 3 && "🥉"}
                        {artist.rank > 3 && artist.rank}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" title={artist.artistname}>
                            {truncateText(artist.artistname, 40)}
                          </div>
                          <div className="text-xs text-muted-foreground">{artist.track_count} titres</div>
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
                          <Image
                            src={album.albumimageurl}
                            alt={album.albumname}
                            width={32}
                            height={32}
                            className="rounded flex-shrink-0"
                          />
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
    </div>
  );
}
