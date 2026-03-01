import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/fetcher";
import { queryKeys } from "@/lib/api/query-keys";
import type {
  ArtistFocusIndexResponse,
  ArtistFocusDetailResponse,
} from "@/types/artist-focus";

export function useArtistFocusList() {
  return useQuery({
    queryKey: queryKeys.music.artistFocusList(),
    queryFn: () =>
      fetcher<ArtistFocusIndexResponse>("/api/music/artist-focus"),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function useArtistFocus(artistId: string | null) {
  return useQuery({
    queryKey: queryKeys.music.artistFocus(artistId ?? ""),
    queryFn: () =>
      fetcher<ArtistFocusDetailResponse>(
        `/api/music/artist-focus/${artistId}`
      ),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    enabled: !!artistId,
  });
}
