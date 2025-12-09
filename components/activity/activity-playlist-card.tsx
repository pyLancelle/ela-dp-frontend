"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PlaylistTrack } from "@/types/activity-detail";
import { Music, ChevronLeft, ChevronRight } from "lucide-react";

interface ActivityPlaylistCardProps {
  playlist: PlaylistTrack[];
  pageSize?: number;
}

export function ActivityPlaylistCard({
  playlist,
  pageSize = 10,
}: ActivityPlaylistCardProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(playlist.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTracks = playlist.slice(startIndex, endIndex);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatPlayedAt = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}min`;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5 text-pink-500" />
          Playlist de course
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentTracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary text-sm font-bold">
                {startIndex + index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{track.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {track.artist}
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-xs text-muted-foreground">
                <div>{formatDuration(track.duration)}</div>
                <div className="text-[10px]">{formatPlayedAt(track.playedAt)}</div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              Titres {startIndex + 1}-{Math.min(endIndex, playlist.length)} sur{" "}
              {playlist.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
