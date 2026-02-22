import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type { ActivityListItem } from "@/components/activity/activity-rich-card";
import type { Activity } from "@/types/activity";
import type { ActivityDetail } from "@/types/activity-detail";
import { activityToDetail } from "@/lib/adapters/activity-adapter";

export function useActivitiesList() {
  return useQuery({
    queryKey: queryKeys.activities.list(),
    queryFn: () => fetcher<ActivityListItem[]>("/api/activites"),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

export interface ActivityDetailData {
  raw: Activity;
  detail: ActivityDetail;
}

export function useActivityDetail(id: string) {
  const isLast = id === "last" || isNaN(parseInt(id, 10));

  return useQuery({
    queryKey: queryKeys.activities.detail(id),
    queryFn: () => fetcher<Activity>(`/api/activites/${id}`),
    staleTime: isLast ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5 min for "last", 1 hour otherwise
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    select: (data): ActivityDetailData => ({
      raw: data,
      detail: activityToDetail(data),
    }),
    enabled: !!id,
  });
}
