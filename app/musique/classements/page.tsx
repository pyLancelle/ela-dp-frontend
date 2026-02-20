"use client";

import { useState } from "react";
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
import { Music, User, Loader2, Disc, ExternalLink } from "lucide-react";
import Image from "next/image";
import { DateRangeFilter, DateFilterPreset } from "@/components/date-range-filter";
import { DateRange } from "react-day-picker";
import { useMusicClassement, type TopArtist } from "@/hooks/queries";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AuroraText } from "@/components/magicui/aurora-text";

interface ArtistTrackBreakdown {
  name: string;
  duration: string;
  playCount: number;
  percentage: number;
}

function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23e5e7eb"/%3E%3Cpath d="M20 12a4 4 0 100 8 4 4 0 000-8zm-7 16a3 3 0 013-3h8a3 3 0 013 3v2H13v-2z" fill="%239ca3af"/%3E%3C/svg%3E';
  }
  return imageUrl;
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="text-xs font-bold text-muted-foreground w-5 inline-block text-center tabular-nums">
      {rank}
    </span>
  );
}

export default function ClassementsPage() {
  const [selectedPreset, setSelectedPreset] = useState<DateFilterPreset>("allTime");
  const { data, isLoading, isFetching, isError, error } = useMusicClassement(selectedPreset, 20);

  const topTracks = data?.top_tracks ?? [];
  const topArtists = data?.top_artists ?? [];
  const topAlbums = data?.top_albums ?? [];

  const [selectedArtist, setSelectedArtist] = useState<TopArtist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [artistTracks, setArtistTracks] = useState<ArtistTrackBreakdown[]>([]);

  const handleArtistClick = (artist: TopArtist) => {
    setSelectedArtist(artist);
    if (artist.tracks && artist.tracks.length > 0) {
      setArtistTracks(artist.tracks.map(track => ({
        name: track.name,
        duration: track.duration,
        playCount: track.play_count,
        percentage: track.percentage,
      })));
    } else {
      setArtistTracks([]);
    }
    setIsDialogOpen(true);
  };

  const handleFilterChange = (preset: DateFilterPreset, _range?: DateRange) => {
    setSelectedPreset(preset);
  };

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
      <BlurFade delay={0} duration={0.5}>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            <AuroraText
              // colors={["#1DB954", "#9c40ff", "#ff6b35", "#1DB954"]}
              speed={1}
            >
              Classements Musicaux
            </AuroraText>
          </h1>
          <p className="text-muted-foreground text-sm">
            Découvrez vos titres, artistes et albums les plus écoutés
          </p>
        </div>
      </BlurFade>

      {/* Date Range Filter */}
      <BlurFade delay={0.05} duration={0.4}>
        <DateRangeFilter selectedPreset={selectedPreset} onFilterChange={handleFilterChange} />
      </BlurFade>

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
        <BlurFade delay={0.1} duration={0.5}>
          <div className="liquid-glass-card relative overflow-hidden rounded-xl">
            <div className="px-4 pt-4 pb-3">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Music className="h-4 w-4 text-emerald-500" />
                Top Titres
                {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto text-muted-foreground" />}
              </h2>
            </div>
            <div className="pb-3">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="w-[32px] px-3 py-1.5 text-xs">#</TableHead>
                      <TableHead className="px-3 py-1.5 text-xs">Titre</TableHead>
                      <TableHead className="text-right px-3 py-1.5 text-xs w-[80px]">Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTracks.map((track) => (
                      <TableRow
                        key={track.rank}
                        className="transition-all duration-150 cursor-pointer group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={track.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={track.trackExternalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 hover:opacity-80 transition-opacity block relative overflow-hidden rounded"
                              style={{ width: 28, height: 28 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Image
                                src={getImageUrl(track.image_url)}
                                alt={track.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                <ExternalLink className="h-2.5 w-2.5 text-white" />
                              </span>
                            </a>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate" title={track.name}>
                                {truncateText(track.name, 36)}
                              </div>
                              <div className="text-[11px] text-muted-foreground truncate" title={track.artist_name}>
                                {truncateText(track.artist_name, 36)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-3 py-1 whitespace-nowrap">
                          <div className="text-xs font-semibold text-foreground">
                            <NumberTicker
                              value={track.play_count}
                              className="text-xs font-semibold"
                            />
                            <span className="text-muted-foreground font-normal"> pl.</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{track.total_duration}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Fade bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 liquid-glass-fade-bottom rounded-b-xl" />
          </div>
        </BlurFade>

        {/* Top Artistes */}
        <BlurFade delay={0.2} duration={0.5}>
          <div className="liquid-glass-card relative overflow-hidden rounded-xl">
            <div className="px-4 pt-4 pb-3">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <User className="h-4 w-4 text-violet-500" />
                Top Artistes
                {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto text-muted-foreground" />}
              </h2>
            </div>
            <div className="pb-3">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="w-[32px] px-3 py-1.5 text-xs">#</TableHead>
                      <TableHead className="px-3 py-2 text-xs">Artiste</TableHead>
                      <TableHead className="text-right px-3 py-2 text-xs w-[90px]">Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topArtists.map((artist) => (
                      <TableRow
                        key={artist.rank}
                        className="transition-all duration-150 cursor-pointer group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                        onClick={() => handleArtistClick(artist)}
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={artist.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={artist.artistexternalurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 hover:opacity-80 transition-opacity block relative overflow-hidden rounded"
                              style={{ width: 28, height: 28 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Image
                                src={getImageUrl(artist.image_url)}
                                alt={artist.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                <ExternalLink className="h-2.5 w-2.5 text-white" />
                              </span>
                            </a>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate" title={artist.name}>
                                {truncateText(artist.name, 36)}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {artist.track_count} titres
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-3 py-1 whitespace-nowrap">
                          <div className="text-xs font-semibold text-foreground">
                            <NumberTicker
                              value={artist.play_count}
                              className="text-xs font-semibold"
                            />
                            <span className="text-muted-foreground font-normal"> pl.</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{artist.total_duration}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Fade bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 liquid-glass-fade-bottom rounded-b-xl" />
          </div>
        </BlurFade>

        {/* Top Albums */}
        <BlurFade delay={0.3} duration={0.5}>
          <div className="liquid-glass-card relative overflow-hidden rounded-xl">
            <div className="px-4 pt-4 pb-3">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Disc className="h-4 w-4 text-orange-500" />
                Top Albums
                {isFetching && <Loader2 className="h-3 w-3 animate-spin ml-auto text-muted-foreground" />}
              </h2>
            </div>
            <div className="pb-3">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="w-[32px] px-3 py-1.5 text-xs">#</TableHead>
                      <TableHead className="px-3 py-1.5 text-xs">Album</TableHead>
                      <TableHead className="text-right px-3 py-1.5 text-xs w-[80px]">Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topAlbums.map((album) => (
                      <TableRow
                        key={album.rank}
                        className="transition-all duration-150 group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={album.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={album.albumexternalurl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 hover:opacity-80 transition-opacity block relative overflow-hidden rounded"
                              style={{ width: 28, height: 28 }}
                            >
                              <Image
                                src={getImageUrl(album.image_url)}
                                alt={album.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                <ExternalLink className="h-2.5 w-2.5 text-white" />
                              </span>
                            </a>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate" title={album.name}>
                                {truncateText(album.name, 36)}
                              </div>
                              <div className="text-[11px] text-muted-foreground truncate" title={album.artist_name}>
                                {truncateText(album.artist_name, 36)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-3 py-1 whitespace-nowrap">
                          <div className="text-xs font-semibold text-foreground">
                            <NumberTicker
                              value={album.play_count}
                              className="text-xs font-semibold"
                            />
                            <span className="text-muted-foreground font-normal"> pl.</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{album.total_duration}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Fade bottom */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 liquid-glass-fade-bottom rounded-b-xl" />
          </div>
        </BlurFade>

      </div>

      {/* Dialog pour afficher la répartition des chansons */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4 text-violet-500" />
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
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-bold text-muted-foreground text-xs flex-shrink-0 w-5 text-center">
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
                    <div className="text-lg font-bold text-violet-600 dark:text-violet-400">
                      {track.percentage}%
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-400 h-full rounded-full transition-all duration-700"
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
