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
    artistFocusList: () =>
      [...queryKeys.music.all, "artistFocusList"] as const,
    artistFocus: (id: string) =>
      [...queryKeys.music.all, "artistFocus", id] as const,
  },
  sleep: {
    all: ["sleep"] as const,
    data: () => [...queryKeys.sleep.all, "data"] as const,
  },
} as const;
