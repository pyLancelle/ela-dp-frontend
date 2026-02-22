/**
 * Unified Activity Types
 * Based on BigQuery schema from `pct_activites__last_run` view
 */

// ===== BigQuery Schema Types =====

export interface FastestSplits {
  fastestSplit_1000: number | null;   // 1km
  fastestSplit_1609: number | null;   // 1 mile
  fastestSplit_5000: number | null;   // 5km
  fastestSplit_10000: number | null;  // 10km
  fastestSplit_21098: number | null;  // Half marathon
  fastestSplit_42195: number | null;  // Marathon
}

export interface HRZones {
  hrTimeInZone_1: number | null;  // Zone 1 - Recovery (seconds)
  hrTimeInZone_2: number | null;  // Zone 2 - Endurance (seconds)
  hrTimeInZone_3: number | null;  // Zone 3 - Tempo (seconds)
  hrTimeInZone_4: number | null;  // Zone 4 - Threshold (seconds)
  hrTimeInZone_5: number | null;  // Zone 5 - VO2Max (seconds)
}

export interface PowerZones {
  powerTimeInZone_1: number | null;
  powerTimeInZone_2: number | null;
  powerTimeInZone_3: number | null;
  powerTimeInZone_4: number | null;
  powerTimeInZone_5: number | null;
}

export interface KilometerLap {
  lapIndex: number;
  startTimeGMT: string;
  distance: number;           // meters
  duration: number;           // seconds
  averageSpeed: number;       // m/s
  calories: number;
  averageHR: number;
  maxHR: number;
  elevationGain: number;      // meters
  elevationLoss: number;      // meters
}

export interface TrainingInterval {
  lapIndex: number | null;
  startTimeGMT: string;
  distance: number;           // meters
  duration: number;           // seconds
  averageSpeed: number;       // m/s
  calories: number;
  averageHR: number;
  maxHR: number;
  elevationGain: number;      // meters
  elevationLoss: number;      // meters
  intensityType: string | null;
  name: string | null;
}

export interface TimeSeriesPoint {
  timestamp: number;          // Unix ms
  distance: number;           // km
  heartRate: number;
  pace: number | null;        // min/km
  altitude: number;
  speed: number;              // km/h
}

export interface TrackPlayed {
  played_at: { value: string } | string | null;
  track_name: string | null;
  artists: string | null;
  album_name: string | null;
  album_image: string | null;
  duration_ms: number | null;
  track_url: string | null;
}

export interface Activity {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  endTimeGMT: string;
  typeKey: string;            // 'running', 'trail_running', 'track_running', 'treadmill_running'
  distance: number | null;    // meters
  duration: number | null;    // seconds
  elapsedDuration: number | null;  // seconds (including pauses)
  elevationGain: number | null;    // meters
  elevationLoss: number | null;    // meters
  averageSpeed: number | null;     // m/s
  hasPolyline: boolean | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  aerobicTrainingEffect: number | null;    // 0-5 scale
  anaerobicTrainingEffect: number | null;  // 0-5 scale
  minElevation: number | null;
  maxElevation: number | null;
  activityTrainingLoad: number | null;
  fastestSplits: FastestSplits | null;
  hr_zones: HRZones | null;
  power_zones: PowerZones | null;
  kilometer_laps: KilometerLap[] | null;
  training_intervals: TrainingInterval[] | null;
  tracks_played: TrackPlayed[] | null;
  time_series: TimeSeriesPoint[] | null;
  coordinates: { lat: number; lng: number }[] | null;
}

// ===== UI Helper Types =====

export type ActivityType = "running" | "cycling" | "swimming" | "hiking" | "trail";
export type IntervalType = "warmup" | "work" | "recovery" | "cooldown" | "rest";

/**
 * Convert meters to kilometers
 */
export function metersToKm(meters: number | null): number {
  return meters ? meters / 1000 : 0;
}

/**
 * Convert m/s to km/h
 */
export function msToKmh(ms: number | null): number {
  return ms ? ms * 3.6 : 0;
}

/**
 * Convert m/s to min/km pace
 */
export function msToPaceMinPerKm(ms: number | null): number {
  if (!ms || ms === 0) return 0;
  const kmh = ms * 3.6;
  return 60 / kmh; // minutes per km
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format pace (min/km) to M'SS"
 */
export function formatPace(minPerKm: number | null): string {
  if (!minPerKm) return '0\'00"';

  const minutes = Math.floor(minPerKm);
  const seconds = Math.floor((minPerKm - minutes) * 60);
  return `${minutes}'${seconds.toString().padStart(2, '0')}"`;
}

/**
 * Get HR zone info
 */
export interface HRZoneInfo {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;
  color: string;
}

export const HR_ZONE_INFO: Record<number, HRZoneInfo> = {
  1: { zone: 1, name: 'Récupération', color: 'hsl(var(--muted))' },        // Gray
  2: { zone: 2, name: 'Endurance', color: 'hsl(217, 91%, 60%)' },          // Blue
  3: { zone: 3, name: 'Tempo', color: 'hsl(142, 71%, 45%)' },              // Green
  4: { zone: 4, name: 'Seuil', color: 'hsl(25, 95%, 53%)' },               // Orange
  5: { zone: 5, name: 'VO2Max', color: 'hsl(0, 84%, 60%)' },               // Red
};

/**
 * Convert HR zones to array format for UI
 */
export function hrZonesToArray(hrZones: HRZones | null): Array<{ zone: number; timeInZone: number; percentage: number }> {
  if (!hrZones) return [];

  const zones = [
    { zone: 1, timeInZone: hrZones.hrTimeInZone_1 || 0 },
    { zone: 2, timeInZone: hrZones.hrTimeInZone_2 || 0 },
    { zone: 3, timeInZone: hrZones.hrTimeInZone_3 || 0 },
    { zone: 4, timeInZone: hrZones.hrTimeInZone_4 || 0 },
    { zone: 5, timeInZone: hrZones.hrTimeInZone_5 || 0 },
  ];

  const totalTime = zones.reduce((sum, z) => sum + z.timeInZone, 0);

  return zones.map(z => ({
    ...z,
    percentage: totalTime > 0 ? (z.timeInZone / totalTime) * 100 : 0,
  }));
}

/**
 * Map typeKey to ActivityType
 */
export function mapTypeKey(typeKey: string): ActivityType {
  switch (typeKey) {
    case 'running':
    case 'trail_running':
    case 'track_running':
    case 'treadmill_running':
      return 'running';
    case 'cycling':
    case 'road_biking':
    case 'mountain_biking':
      return 'cycling';
    case 'swimming':
    case 'open_water_swimming':
      return 'swimming';
    case 'hiking':
      return 'hiking';
    default:
      return 'running';
  }
}
