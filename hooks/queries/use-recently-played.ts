import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { queryKeys, type RecentlyPlayedFilters } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type { RecentlyPlayedResponse } from "@/types/music";

function buildQueryString(filters: RecentlyPlayedFilters): string {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.pageSize) params.append("pageSize", filters.pageSize.toString());
  if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.append("dateTo", filters.dateTo);
  if (filters.timeFrom) params.append("timeFrom", filters.timeFrom);
  if (filters.timeTo) params.append("timeTo", filters.timeTo);
  if (filters.artist) params.append("artist", filters.artist);

  return params.toString();
}

export function useRecentlyPlayed(filters: RecentlyPlayedFilters) {
  const queryString = buildQueryString(filters);

  return useQuery({
    queryKey: queryKeys.music.recentlyPlayed(filters),
    queryFn: () =>
      fetcher<RecentlyPlayedResponse>(
        `/api/music/recently-played?${queryString}`
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
  });
}
