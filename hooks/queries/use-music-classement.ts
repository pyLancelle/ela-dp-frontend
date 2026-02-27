import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type { DateFilterPreset } from "@/components/date-range-filter";

export interface TopTrack {
  rank: number;
  name: string;
  artist_name: string;
  total_duration: string;
  play_count: number;
  external_url: string;
  image_url: string;
}

export interface TopArtist {
  rank: number;
  name: string;
  total_duration: string;
  play_count: number;
  image_url: string;
  external_url: string;
  tracks?: {
    name: string;
    duration: string;
    play_count: number;
    percentage: number;
  }[];
}

export interface TopAlbum {
  rank: number;
  name: string;
  artist_name: string;
  total_duration: string;
  play_count: number;
  image_url: string;
  external_url: string;
}

export interface MusicClassementResponse {
  top_tracks: TopTrack[];
  top_artists: TopArtist[];
  top_albums: TopAlbum[];
}

const presetToPeriod: Record<DateFilterPreset, string> = {
  yesterday: "yesterday",
  "7days": "last_7_days",
  "30days": "last_30_days",
  thisYear: "last_365_days",
  allTime: "all_time",
  custom: "all_time",
};

export function useMusicClassement(
  preset: DateFilterPreset,
  limit: number = 20
) {
  const period = presetToPeriod[preset];

  return useQuery({
    queryKey: queryKeys.music.classement(period, limit),
    queryFn: () =>
      fetcher<MusicClassementResponse>(
        `/api/music/music-classement?period=${period}&limit=${limit}`
      ),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    placeholderData: (previousData) => previousData,
  });
}
