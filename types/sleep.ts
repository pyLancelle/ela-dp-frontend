// Types pour les données brutes de l'API sommeil (GCS JSON)
export interface SleepRawData {
  sleep_stages: {
    level_name: string;
    start_time: string;
    end_time: string;
  }[];
  sleep_scores: {
    average: number;
    daily: {
      date: string;
      day: string;
      score: number;
    }[];
  };
  body_battery: {
    average_gain: number;
    daily: {
      date: string;
      day: string;
      bedtime: number;
      waketime: number;
      gain: number;
    }[];
  };
  hrv: {
    average: number;
    baseline: number;
    daily: {
      date: string;
      day: string;
      value: number;
      is_above_baseline: boolean;
    }[];
  };
  resting_hr: {
    average: number;
    daily: {
      date: string;
      day: string;
      value: number;
    }[];
  };
  sleep_duration: {
    average_minutes: number;
    daily: {
      date: string;
      day: string;
      duration_minutes: number;
      bedtime: string;
      waketime: string;
    }[];
  };
  stress_daily: {
    average_stress: number;
    daily: {
      date: string;
      day: string;
      avg_stress: number;
    }[];
  };
}

// Types transformés côté client
export type SleepStage = "awake" | "rem" | "core" | "deep";

export interface SleepSegment {
  startTime: string;
  endTime: string;
  stage: SleepStage;
}

export interface SleepPageData {
  sleepStages: SleepSegment[];
  sleepScores: {
    average: number;
    daily: { day: string; score: number; date: string }[];
  };
  bodyBattery: {
    average: number;
    daily: { day: string; range: [number, number]; delta: number; date: string }[];
  };
  hrv: {
    average: number;
    baseline: number;
    daily: { day: string; hrv: number; date: string; isAboveBaseline: boolean }[];
  };
  restingHr: {
    average: number;
    daily: { day: string; hr: number; date: string }[];
  };
  sleepDuration: {
    averageMinutes: number;
    daily: { day: string; durationMinutes: number; bedtime: string; waketime: string; date: string }[];
  };
  stress: {
    average: number;
    daily: { day: string; stress: number; date: string }[];
  };
}
