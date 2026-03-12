import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type {
  SleepOverviewRaw,
  SleepOverviewData,
  SleepNightRaw,
  SleepNightData,
  SleepStage,
} from "@/types/sleep";

// ── Overview (30 days) ──────────────────────────────────────────────

function transformOverview(raw: SleepOverviewRaw): SleepOverviewData {
  return {
    currentMonth: {
      avgScore: raw.current_month.avg_score,
      avgDurationMinutes: raw.current_month.avg_duration_minutes,
      avgHrv: raw.current_month.avg_hrv,
      avgRestingHr: raw.current_month.avg_resting_hr,
      avgBodyBatteryGain: raw.current_month.avg_body_battery_gain,
      avgBedtime: raw.current_month.avg_bedtime,
      avgWaketime: raw.current_month.avg_waketime,
    },
    previousMonth: {
      avgScore: raw.previous_month.avg_score,
      avgDurationMinutes: raw.previous_month.avg_duration_minutes,
      avgHrv: raw.previous_month.avg_hrv,
      avgRestingHr: raw.previous_month.avg_resting_hr,
      avgBodyBatteryGain: raw.previous_month.avg_body_battery_gain,
    },
    daily: raw.daily.map((d) => ({
      date: d.date,
      day: d.day,
      score: d.score,
      durationMinutes: d.duration_minutes,
      hrv: d.hrv,
      restingHr: d.resting_hr,
      bodyBatteryGain: d.body_battery_gain,
      bedtime: d.bedtime,
      waketime: d.waketime,
    })),
  };
}

export function useSleepOverview() {
  return useQuery({
    queryKey: queryKeys.sleep.overview(),
    queryFn: () => fetcher<SleepOverviewRaw>("/api/sommeil"),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: transformOverview,
  });
}

// ── Night detail ────────────────────────────────────────────────────

function transformNight(raw: SleepNightRaw): SleepNightData {
  return {
    date: raw.date,
    score: raw.score,
    durationMinutes: raw.duration_minutes,
    hrv: raw.hrv,
    restingHr: raw.resting_hr,
    bodyBatteryGain: raw.body_battery_gain,
    bedtime: raw.bedtime,
    waketime: raw.waketime,
    stress: raw.stress,
    stages: raw.stages.map((s) => {
      let stage: SleepStage = s.level_name as SleepStage;
      if (s.level_name === "light") stage = "core";
      else if (s.level_name === "awake_restless") stage = "awake";
      return { startTime: s.start_time, endTime: s.end_time, stage };
    }),
  };
}

export function useSleepNight(date: string) {
  return useQuery({
    queryKey: queryKeys.sleep.night(date),
    queryFn: () => fetcher<SleepNightRaw>(`/api/sommeil/${date}`),
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    select: transformNight,
    enabled: !!date,
  });
}
