import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { fetcher } from "@/lib/api/fetcher";
import type {
  MusicDashboardData,
  SleepBodyBatteryData,
  RunningWeeklyData,
  RunningWeeklyVolumeData,
  RacePredictionsData,
} from "@/types/dashboard";

// Types pour les données brutes de l'API
interface HomepageRawData {
  music_time_daily: {
    data: {
      date: string;
      total_duration_ms: number;
      bar_height_percent: number;
      day_letter: string;
      duration_formatted: string;
    }[];
    avg_duration_formatted: string;
  };
  top_artists: {
    rank: number;
    artistname: string;
    play_count: number;
    total_duration: string;
    albumimageurl: string | null;
    artistexternalurl: string | null;
    artistid?: string;
  }[];
  top_tracks: {
    rank: number;
    trackname: string;
    all_artist_names: string;
    total_duration: string;
    play_count: number;
    albumimageurl: string | null;
    trackExternalUrl: string | null;
  }[];
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
      display_height_percent: number;
    }[];
  };
  resting_hr: {
    average: number;
    daily: {
      date: string;
      day: string;
      value: number;
      display_height_percent: number;
    }[];
  };
  running_weekly: {
    date: string;
    total_distance_km: number;
    aerobic_score: number;
    anaerobic_score: number;
  }[];
  running_weekly_volume: {
    week_start: string;
    total_distance_km: number;
  }[];
  race_predictions: {
    distance: string;
    current_time: number;
    diff_seconds: number;
  }[];
  vo2max_trend?: {
    current_date: string;
    current_vo2max: number;
    weekly_vo2max_array: number[];
    vo2max_delta_6_months: number;
  };
  stress_daily?: {
    average_stress: number;
    daily: {
      date: string;
      day: string;
      avg_stress: number;
      max_stress: number;
    }[];
  };
  steps?: {
    average: number;
    goal: number;
    daily: {
      date: string;
      day: string;
      steps: number;
    }[];
  };
}

type SleepStage = "awake" | "rem" | "core" | "deep";

export interface SleepData {
  startTime: string;
  endTime: string;
  stage: SleepStage;
}

export interface HomepageData {
  music: MusicDashboardData | null;
  sleepStages: SleepData[];
  sleepBodyBattery: SleepBodyBatteryData | null;
  running: RunningWeeklyData | null;
  weeklyVolume: RunningWeeklyVolumeData | null;
  racePredictions: RacePredictionsData | null;
  vo2maxTrend: {
    currentDate: string;
    currentVo2max: number;
    weeklyVo2maxArray: number[];
    vo2maxDelta6Months: number;
  } | null;
  stress: {
    average: number;
    daily: { day: string; stress: number; date: string }[];
  } | null;
  steps: {
    average: number;
    goal: number;
    daily: { day: string; steps: number; date: string }[];
  } | null;
}

// Helper functions
function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatTime(seconds: number | string): string {
  const totalSeconds =
    typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
  if (isNaN(totalSeconds)) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatDifference(diffSeconds: number | string): string {
  const diff =
    typeof diffSeconds === "string" ? parseInt(diffSeconds, 10) : diffSeconds;
  if (isNaN(diff)) return "0:00";

  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / 60);
  const secs = Math.floor(absDiff % 60);
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${minutes}:${secs.toString().padStart(2, "0")}`;
}

function transformHomepageData(data: HomepageRawData): HomepageData {
  let music: MusicDashboardData | null = null;
  let sleepStages: SleepData[] = [];
  let sleepBodyBattery: SleepBodyBatteryData | null = null;
  let running: RunningWeeklyData | null = null;
  let weeklyVolume: RunningWeeklyVolumeData | null = null;
  let racePredictions: RacePredictionsData | null = null;
  let vo2maxTrend: HomepageData["vo2maxTrend"] = null;
  let stress: HomepageData["stress"] = null;
  let steps: HomepageData["steps"] = null;

  // Transform music data
  if (data.music_time_daily && data.top_artists && data.top_tracks) {
    // Les données sont maintenant pré-formatées par le backend
    const days = data.music_time_daily.data.map((row) => ({
      date: row.date,
      day: row.day_letter, // Utilise directement la lettre du backend
      duration: row.total_duration_ms,
      formatted: row.duration_formatted,
      heightPercentage: row.bar_height_percent,
    }));

    music = {
      generatedAt: new Date().toISOString(),
      period: "last_7_days",
      listeningTime: {
        averagePerDay: data.music_time_daily.avg_duration_formatted,
        days
      },
      topArtists: data.top_artists.map((artist) => ({
        rank: artist.rank,
        name: artist.artistname || "Artiste inconnu",
        trackCount: artist.play_count || 0,
        totalDuration: artist.total_duration || "0h 0m",
        playCount: artist.play_count || 0,
        imageUrl: artist.albumimageurl || null,
        externalUrl: artist.artistexternalurl || null,
        artistId: artist.artistid || undefined,
      })),
      topTracks: data.top_tracks.map((track) => ({
        rank: track.rank,
        name: track.trackname || "Titre inconnu",
        artistName: track.all_artist_names || "Artiste inconnu",
        totalDuration: track.total_duration || "0m 0s",
        playCount: track.play_count || 0,
        imageUrl: track.albumimageurl || null,
        externalUrl: track.trackExternalUrl || null,
      })),
    };
  }

  // Transform sleep stages
  if (data.sleep_stages) {
    sleepStages = data.sleep_stages.map((row) => {
      let stage: SleepStage = row.level_name as SleepStage;
      if (row.level_name === "light") stage = "core";
      else if (row.level_name === "awake_restless") stage = "awake";

      return {
        startTime: row.start_time,
        endTime: row.end_time,
        stage,
      };
    });
  }

  // Sleep & Body Battery data - now pre-formatted by backend
  if (data.sleep_scores && data.body_battery && data.hrv && data.resting_hr) {
    sleepBodyBattery = {
      sleepScores: {
        average: data.sleep_scores.average,
        daily: data.sleep_scores.daily.map((item) => ({
          day: item.day,
          score: item.score,
          date: item.date,
        })),
      },
      bodyBattery: {
        average: data.body_battery.average_gain,
        daily: data.body_battery.daily.map((item) => ({
          day: item.day,
          range: [item.bedtime, item.waketime] as [number, number],
          delta: item.gain,
          date: item.date,
        })),
      },
      hrv: {
        average: data.hrv.average,
        daily: data.hrv.daily.map((item) => ({
          day: item.day,
          hrv: item.value,
          date: item.date,
        })),
      },
      restingHr: {
        average: data.resting_hr.average,
        daily: data.resting_hr.daily.map((item) => ({
          day: item.day,
          hr: item.value,
          date: item.date,
        })),
      },
    };
  }

  // Transform running weekly data
  if (data.running_weekly) {
    const weeklyRows = data.running_weekly;

    const totalDistance = weeklyRows.reduce(
      (sum, row) => sum + (row.total_distance_km || 0),
      0
    );
    const sessionCount = weeklyRows.filter(
      (row) => row.total_distance_km > 0
    ).length;
    const averagePerSession =
      sessionCount > 0 ? totalDistance / sessionCount : 0;

    const maxAerobic = Math.max(
      ...weeklyRows.map((row) => row.aerobic_score || 0),
      5
    );
    const maxAnaerobic = Math.max(
      ...weeklyRows.map((row) => row.anaerobic_score || 0),
      5
    );

    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    const last10Days = [];
    const today = new Date();

    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = dayNames[date.getDay()];

      const matchingRow = weeklyRows.find((row) => row.date === dateStr);

      const aerobicScore = matchingRow?.aerobic_score || 0;
      const anaerobicScore = matchingRow?.anaerobic_score || 0;
      const aerobicHeightPercentage =
        maxAerobic > 0 ? (aerobicScore / maxAerobic) * 100 : 0;
      const anaerobicHeightPercentage =
        maxAnaerobic > 0 ? (anaerobicScore / maxAnaerobic) * 100 : 0;

      last10Days.push({
        day: dayOfWeek,
        date: dateStr,
        distance: matchingRow?.total_distance_km || 0,
        aerobicScore,
        anaerobicScore,
        aerobicHeightPercentage,
        anaerobicHeightPercentage,
      });
    }

    running = {
      generatedAt: new Date().toISOString(),
      totalDistance: Math.round(totalDistance * 10) / 10,
      sessionCount,
      averagePerSession: Math.round(averagePerSession * 10) / 10,
      daily: last10Days,
    };
  }

  // Transform weekly volume data
  if (data.running_weekly_volume) {
    const volumeRows = data.running_weekly_volume;
    const sortedRows = [...volumeRows].reverse();

    const totalVolume = volumeRows.reduce(
      (sum, row) => sum + (row.total_distance_km || 0),
      0
    );
    const average = totalVolume / volumeRows.length;
    const max = Math.max(...volumeRows.map((row) => row.total_distance_km || 0));

    const mostRecentWeek = volumeRows[0]?.week_start;

    const weeks = sortedRows.map((row, index) => {
      const weeksFromNow = sortedRows.length - 1 - index;
      const isCurrent = row.week_start === mostRecentWeek;
      const weekLabel = isCurrent ? "S0" : `S-${weeksFromNow}`;

      const weekStartDate = new Date(row.week_start);
      const weekNumber = getWeekNumber(weekStartDate);
      const year = weekStartDate.getFullYear();

      return {
        week: weekLabel,
        volume: Math.round(row.total_distance_km * 10) / 10,
        isCurrent,
        weekNumber,
        year,
        startDate: row.week_start,
      };
    });

    weeklyVolume = {
      generatedAt: new Date().toISOString(),
      average: Math.round(average * 10) / 10,
      max: Math.round(max * 10) / 10,
      weeks,
    };
  }

  // Transform race predictions
  if (data.race_predictions) {
    const predictions = data.race_predictions.map((row) => ({
      distance: row.distance,
      time: formatTime(row.current_time),
      difference: formatDifference(row.diff_seconds),
      isImprovement: row.diff_seconds < 0,
      diffSeconds: row.diff_seconds,
    }));

    racePredictions = {
      generatedAt: new Date().toISOString(),
      predictions,
    };
  }

  // Transform VO2max trend data
  if (data.vo2max_trend) {
    vo2maxTrend = {
      currentDate: data.vo2max_trend.current_date,
      currentVo2max: data.vo2max_trend.current_vo2max,
      weeklyVo2maxArray: data.vo2max_trend.weekly_vo2max_array,
      vo2maxDelta6Months: data.vo2max_trend.vo2max_delta_6_months,
    };
  }

  // Transform stress data
  if (data.stress_daily) {
    stress = {
      average: data.stress_daily.average_stress,
      daily: data.stress_daily.daily.map((item) => ({
        day: item.day,
        stress: item.avg_stress,
        date: item.date,
      })),
    };
  }

  // Transform steps data
  if (data.steps) {
    steps = {
      average: data.steps.average,
      goal: data.steps.goal,
      daily: data.steps.daily.map((item) => ({
        day: item.day,
        steps: item.steps,
        date: item.date,
      })),
    };
  }

  return {
    music,
    sleepStages,
    sleepBodyBattery,
    running,
    weeklyVolume,
    racePredictions,
    vo2maxTrend,
    stress,
    steps,
  };
}

export function useHomepage() {
  return useQuery({
    queryKey: queryKeys.homepage.data(),
    queryFn: () => fetcher<HomepageRawData>("/api/homepage"),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    select: transformHomepageData,
  });
}
