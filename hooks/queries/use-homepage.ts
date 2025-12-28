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
    date: string;
    total_duration_ms: number;
  }[];
  top_artists: {
    rank: number;
    artistname: string;
    play_count: number;
    total_duration: string;
    albumimageurl: string | null;
    artistexternalurl: string | null;
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
  sleep_body_battery: {
    date: string;
    day_abbr_french: string;
    sleep_score: number;
    battery_at_bedtime: number;
    battery_at_waketime: number;
    battery_gain: number;
    avg_hrv: number;
    resting_hr: number;
  }[];
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
}

export interface HomepageData {
  music: MusicDashboardData | null;
  sleepStages: { startTime: string; endTime: string; stage: string }[];
  sleepBodyBattery: SleepBodyBatteryData | null;
  running: RunningWeeklyData | null;
  weeklyVolume: RunningWeeklyVolumeData | null;
  racePredictions: RacePredictionsData | null;
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
  let sleepStages: { startTime: string; endTime: string; stage: string }[] = [];
  let sleepBodyBattery: SleepBodyBatteryData | null = null;
  let running: RunningWeeklyData | null = null;
  let weeklyVolume: RunningWeeklyVolumeData | null = null;
  let racePredictions: RacePredictionsData | null = null;

  // Transform music data
  if (data.music_time_daily && data.top_artists && data.top_tracks) {
    const musicTimeDailyRows = data.music_time_daily;
    const sortedRows = [...musicTimeDailyRows].reverse();

    const totalMs = musicTimeDailyRows.reduce(
      (sum, row) => sum + (row.total_duration_ms || 0),
      0
    );
    const averageMs = totalMs / musicTimeDailyRows.length;
    const avgHours = Math.floor(averageMs / (1000 * 60 * 60));
    const avgMinutes = Math.floor(
      (averageMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const averagePerDay = `${avgHours}h ${avgMinutes}m`;

    const maxDuration = Math.max(
      ...musicTimeDailyRows.map((row) => row.total_duration_ms || 0)
    );

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const days = sortedRows.map((row) => {
      const dateObj = new Date(row.date);
      const day = dayNames[dateObj.getDay()];
      const durationMs = row.total_duration_ms || 0;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const formatted = hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`;
      const heightPercentage =
        maxDuration > 0 ? (durationMs / maxDuration) * 100 : 0;

      return {
        date: row.date,
        day,
        duration: durationMs,
        formatted,
        heightPercentage,
      };
    });

    music = {
      generatedAt: new Date().toISOString(),
      period: "last_7_days",
      listeningTime: { averagePerDay, days },
      topArtists: data.top_artists.map((artist) => ({
        rank: artist.rank,
        name: artist.artistname || "Artiste inconnu",
        trackCount: artist.play_count || 0,
        totalDuration: artist.total_duration || "0h 0m",
        playCount: artist.play_count || 0,
        imageUrl: artist.albumimageurl || null,
        externalUrl: artist.artistexternalurl || null,
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
      let stage = row.level_name;
      if (stage === "light") stage = "core";
      else if (stage === "awake_restless") stage = "awake";

      return {
        startTime: row.start_time,
        endTime: row.end_time,
        stage,
      };
    });
  }

  // Transform sleep body battery data
  if (data.sleep_body_battery) {
    const sleepRows = data.sleep_body_battery;

    const validSleepScores = sleepRows.filter(
      (row) => row.sleep_score !== null
    );
    const averageSleepScore =
      validSleepScores.length > 0
        ? Math.round(
            validSleepScores.reduce((sum, row) => sum + row.sleep_score, 0) /
              validSleepScores.length
          )
        : 0;

    const validDeltas = sleepRows.filter((row) => row.battery_gain !== null);
    const averageDelta =
      validDeltas.length > 0
        ? Math.round(
            validDeltas.reduce((sum, row) => sum + row.battery_gain, 0) /
              validSleepScores.length
          )
        : 0;

    const validHrv = sleepRows.filter((row) => row.avg_hrv !== null);
    const averageHrv =
      validHrv.length > 0
        ? Math.round(
            validHrv.reduce((sum, row) => sum + row.avg_hrv, 0) / validHrv.length
          )
        : 0;

    const validRestingHr = sleepRows.filter((row) => row.resting_hr !== null);
    const averageRestingHr =
      validRestingHr.length > 0
        ? Math.round(
            validRestingHr.reduce((sum, row) => sum + row.resting_hr, 0) /
              validRestingHr.length
          )
        : 0;

    sleepBodyBattery = {
      sleepScores: {
        average: averageSleepScore,
        daily: sleepRows.map((row) => ({
          day: row.day_abbr_french || "",
          score: row.sleep_score || 0,
          date: row.date,
        })),
      },
      bodyBattery: {
        average: averageDelta,
        daily: sleepRows.map((row) => ({
          day: row.day_abbr_french || "",
          range: [
            row.battery_at_bedtime || 0,
            row.battery_at_waketime || 0,
          ] as [number, number],
          delta: row.battery_gain || 0,
          date: row.date,
        })),
      },
      hrv: {
        average: averageHrv,
        daily: sleepRows.map((row) => ({
          day: row.day_abbr_french || "",
          hrv: row.avg_hrv || 0,
          date: row.date,
        })),
      },
      restingHr: {
        average: averageRestingHr,
        daily: sleepRows.map((row) => ({
          day: row.day_abbr_french || "",
          hr: row.resting_hr || 0,
          date: row.date,
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

  return {
    music,
    sleepStages,
    sleepBodyBattery,
    running,
    weeklyVolume,
    racePredictions,
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
