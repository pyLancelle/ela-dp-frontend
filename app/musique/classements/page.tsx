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
import { Music, User, Loader2, Disc, ExternalLink } from "lucide-react";
import Image from "next/image";
import { DateRangeFilter, DateFilterPreset } from "@/components/date-range-filter";
import { DateRange } from "react-day-picker";
import { useMusicClassement } from "@/hooks/queries";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BlurFade } from "@/components/magicui/blur-fade";

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
                    {topTracks.map((track, i) => (
                      <TableRow
                        key={track.rank}
                        className="transition-all duration-150 cursor-pointer group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                        style={{ animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${0.1 + i * 0.04}s` }}
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={track.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={track.external_url}
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
                          <div className="text-xs font-semibold text-foreground">{track.total_duration}</div>
                          <div className="text-[11px] text-muted-foreground">
                            <NumberTicker
                              value={track.play_count}
                              className="text-[11px]"
                            />
                            <span> pl.</span>
                          </div>
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
                    {topArtists.map((artist, i) => (
                      <TableRow
                        key={artist.rank}
                        className="transition-all duration-150 group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                        style={{ animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${0.1 + i * 0.04}s` }}
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={artist.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={artist.external_url}
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
                                {artist.play_count} plays
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-3 py-1 whitespace-nowrap">
                          <div className="text-xs font-semibold text-foreground">{artist.total_duration}</div>
                          <div className="text-[11px] text-muted-foreground">
                            <NumberTicker
                              value={artist.play_count}
                              className="text-[11px]"
                            />
                            <span> pl.</span>
                          </div>
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
                    {topAlbums.map((album, i) => (
                      <TableRow
                        key={album.rank}
                        className="transition-all duration-150 group hover:bg-white/10 dark:hover:bg-white/5 border-white/8"
                        style={{ animation: `fadeSlideIn 0.3s ease both`, animationDelay: `${0.1 + i * 0.04}s` }}
                      >
                        <TableCell className="px-3 py-1 font-medium">
                          <RankBadge rank={album.rank} />
                        </TableCell>
                        <TableCell className="px-3 py-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <a
                              href={album.external_url}
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
                          <div className="text-xs font-semibold text-foreground">{album.total_duration}</div>
                          <div className="text-[11px] text-muted-foreground">
                            <NumberTicker
                              value={album.play_count}
                              className="text-[11px]"
                            />
                            <span> pl.</span>
                          </div>
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

    </div>
  );
}
