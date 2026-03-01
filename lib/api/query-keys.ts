export interface RecentlyPlayedFilters {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
  timeTo?: string;
  artist?: string;
}

export const queryKeys = {
  homepage: {
    all: ["homepage"] as const,
    data: () => [...queryKeys.homepage.all, "data"] as const,
  },
  activities: {
    all: ["activities"] as const,
    list: () => [...queryKeys.activities.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.activities.all, "detail", id] as const,
  },
  music: {
    all: ["music"] as const,
    classement: (period: string, limit?: number) =>
      [...queryKeys.music.all, "classement", { period, limit }] as const,
    recentlyPlayed: (filters: RecentlyPlayedFilters) =>
      [...queryKeys.music.all, "recentlyPlayed", filters] as const,
    artistFocusList: () =>
      [...queryKeys.music.all, "artistFocusList"] as const,
    artistFocus: (id: string) =>
      [...queryKeys.music.all, "artistFocus", id] as const,
  },
} as const;
