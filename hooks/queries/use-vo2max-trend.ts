import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type { Vo2maxTrendData } from "@/types/dashboard";

export function useVo2maxTrend() {
  return useQuery({
    queryKey: queryKeys.vo2maxTrend.data(),
    queryFn: () => fetcher<Vo2maxTrendData>("/api/vo2max-trend"),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}
