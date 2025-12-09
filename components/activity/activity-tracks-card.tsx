"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Music } from "lucide-react";
import Image from "next/image";

export interface TrackPlayed {
  played_at: { value: string } | null;
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

// Fonction pour tronquer le texte avec points de suspension
function truncateText(text: string | undefined | null, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Fonction pour obtenir l'URL de l'image ou un placeholder
function getImageUrl(imageUrl: string | undefined | null): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23e5e7eb"%2F%3E%3Cpath d="M16 10a3 3 0 100 6 3 3 0 000-6zm-5 12a2 2 0 012-2h6a2 2 0 012 2v2H11v-2z" fill="%239ca3af"%2F%3E%3C/svg%3E';
  }
  return imageUrl;
}

// Fonction pour formater la durée en ms vers mm:ss
function formatDuration(durationMs: number | null): string {
  if (!durationMs) return '-';
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Fonction pour formater l'heure de lecture
function formatPlayedAt(playedAt: { value: string } | null): string {
  if (!playedAt?.value) return '-';
  const date = new Date(playedAt.value);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function ActivityTracksCard({ tracks }: ActivityTracksCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Music className="h-4 w-4" />
          Titres écoutés pendant l'activité
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="overflow-x-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] p-2">Heure</TableHead>
                <TableHead className="p-2 min-w-[200px]">Titre</TableHead>
                <TableHead className="text-right p-2 w-[80px]">Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.length > 0 ? (
                tracks.map((track, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell className="p-2 text-xs text-muted-foreground">
                      {formatPlayedAt(track.played_at)}
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <a
                          href={track.track_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 hover:opacity-80 transition-opacity block w-8 h-8 relative overflow-hidden rounded"
                        >
                          <Image
                            src={getImageUrl(track.album_image)}
                            alt={track.track_name || 'Album cover'}
                            fill
                            className="object-cover"
                          />
                        </a>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" title={track.track_name || ''}>
                            {truncateText(track.track_name, 40)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate" title={track.artists || ''}>
                            {truncateText(track.artists, 40)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right p-2 whitespace-nowrap">
                      <div className="text-sm font-medium">{formatDuration(track.duration_ms)}</div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <p className="text-muted-foreground text-sm">
                      Aucun titre écouté enregistré pour cette activité
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
