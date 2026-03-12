// ── Raw API types (GCS JSON) ────────────────────────────────────────

export interface SleepOverviewRaw {
  current_month: SleepMonthStats;
  previous_month: SleepMonthStats;
  daily: SleepDailyRow[];
}

export interface SleepMonthStats {
  avg_score: number;
  avg_duration_minutes: number;
  avg_hrv: number;
  avg_resting_hr: number;
  avg_body_battery_gain: number;
  avg_bedtime: string;
  avg_waketime: string;
}

export interface SleepDailyRow {
  date: string;
  day: string;
  score: number;
  duration_minutes: number;
  hrv: number;
  resting_hr: number;
  body_battery_gain: number;
  bedtime: string;
  waketime: string;
}

export interface SleepNightRaw {
  date: string;
  score: number;
  duration_minutes: number;
  hrv: number;
  resting_hr: number;
  body_battery_gain: number;
  bedtime: string;
  waketime: string;
  stress: number;
  stages: {
    level_name: string;
    start_time: string;
    end_time: string;
  }[];
}

// ── Transformed client types ────────────────────────────────────────

export type SleepStage = "awake" | "rem" | "core" | "deep";

export interface SleepSegment {
  startTime: string;
  endTime: string;
  stage: SleepStage;
}

export interface SleepOverviewData {
  currentMonth: {
    avgScore: number;
    avgDurationMinutes: number;
    avgHrv: number;
    avgRestingHr: number;
    avgBodyBatteryGain: number;
    avgBedtime: string;
    avgWaketime: string;
  };
  previousMonth: {
    avgScore: number;
    avgDurationMinutes: number;
    avgHrv: number;
    avgRestingHr: number;
    avgBodyBatteryGain: number;
  };
  daily: {
    date: string;
    day: string;
    score: number;
    durationMinutes: number;
    hrv: number;
    restingHr: number;
    bodyBatteryGain: number;
    bedtime: string;
    waketime: string;
  }[];
}

export interface SleepNightData {
  date: string;
  score: number;
  durationMinutes: number;
  hrv: number;
  restingHr: number;
  bodyBatteryGain: number;
  bedtime: string;
  waketime: string;
  stress: number;
  stages: SleepSegment[];
}
