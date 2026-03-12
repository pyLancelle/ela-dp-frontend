import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type {
  SleepRawData,
  SleepPageData,
  SleepStage,
} from "@/types/sleep";

function transformSleepData(data: SleepRawData): SleepPageData {
  // Sleep stages
  const sleepStages = (data.sleep_stages ?? []).map((row) => {
    let stage: SleepStage = row.level_name as SleepStage;
    if (row.level_name === "light") stage = "core";
    else if (row.level_name === "awake_restless") stage = "awake";
    return { startTime: row.start_time, endTime: row.end_time, stage };
  });

  // Sleep scores
  const sleepScores = {
    average: data.sleep_scores?.average ?? 0,
    daily: (data.sleep_scores?.daily ?? []).map((d) => ({
      day: d.day,
      score: d.score,
      date: d.date,
    })),
  };

  // Body battery
  const bodyBattery = {
    average: data.body_battery?.average_gain ?? 0,
    daily: (data.body_battery?.daily ?? []).map((d) => ({
      day: d.day,
      range: [d.bedtime, d.waketime] as [number, number],
      delta: d.gain,
      date: d.date,
    })),
  };

  // HRV
  const hrv = {
    average: data.hrv?.average ?? 0,
    baseline: data.hrv?.baseline ?? 0,
    daily: (data.hrv?.daily ?? []).map((d) => ({
      day: d.day,
      hrv: d.value,
      date: d.date,
      isAboveBaseline: d.is_above_baseline,
    })),
  };

  // Resting HR
  const restingHr = {
    average: data.resting_hr?.average ?? 0,
    daily: (data.resting_hr?.daily ?? []).map((d) => ({
      day: d.day,
      hr: d.value,
      date: d.date,
    })),
  };

  // Sleep duration
  const sleepDuration = {
    averageMinutes: data.sleep_duration?.average_minutes ?? 0,
    daily: (data.sleep_duration?.daily ?? []).map((d) => ({
      day: d.day,
      durationMinutes: d.duration_minutes,
      bedtime: d.bedtime,
      waketime: d.waketime,
      date: d.date,
    })),
  };

  // Stress
  const stress = {
    average: data.stress_daily?.average_stress ?? 0,
    daily: (data.stress_daily?.daily ?? []).map((d) => ({
      day: d.day,
      stress: d.avg_stress,
      date: d.date,
    })),
  };

  return {
    sleepStages,
    sleepScores,
    bodyBattery,
    hrv,
    restingHr,
    sleepDuration,
    stress,
  };
}

export function useSleep() {
  return useQuery({
    queryKey: queryKeys.sleep.data(),
    queryFn: () => fetcher<SleepRawData>("/api/sommeil"),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    select: transformSleepData,
  });
}
