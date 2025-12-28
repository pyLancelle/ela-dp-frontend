import { NextResponse } from "next/server";

interface CachePreset {
  maxAge: number;
  staleWhileRevalidate?: number;
}

const CACHE_PRESETS = {
  homepage: { maxAge: 900, staleWhileRevalidate: 1800 }, // 15min fresh, 30min stale
  activitiesList: { maxAge: 600, staleWhileRevalidate: 1200 }, // 10min fresh, 20min stale
  activityDetail: { maxAge: 3600, staleWhileRevalidate: 7200 }, // 1hr fresh, 2hr stale
  activityLast: { maxAge: 300, staleWhileRevalidate: 600 }, // 5min fresh, 10min stale
  musicClassement: { maxAge: 3600, staleWhileRevalidate: 7200 }, // 1hr fresh, 2hr stale
  recentlyPlayed: { maxAge: 300, staleWhileRevalidate: 600 }, // 5min fresh, 10min stale
} as const;

export type CachePresetKey = keyof typeof CACHE_PRESETS;

export function cachedResponse<T>(
  data: T,
  preset: CachePresetKey
): NextResponse {
  const { maxAge, staleWhileRevalidate } = CACHE_PRESETS[preset];

  const cacheControl = [
    "public",
    `max-age=${maxAge}`,
    staleWhileRevalidate ? `stale-while-revalidate=${staleWhileRevalidate}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": cacheControl,
      "CDN-Cache-Control": cacheControl,
      "Vercel-CDN-Cache-Control": cacheControl,
    },
  });
}

export function errorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
