/**
 * Adapters to convert BigQuery Activity data to UI component formats
 */

import type { Activity, KilometerLap } from '@/types/activity';
import type {
  ActivityDetail,
  ActivitySummary,
  PerformanceScores,
  HeartRateZone,
  ActivityInterval,
  TimeSeriesPoint,
} from '@/types/activity-detail';
import {
  metersToKm,
  msToKmh,
  msToPaceMinPerKm,
  hrZonesToArray,
  HR_ZONE_INFO
} from '@/types/activity';

/**
 * Convert BigQuery Activity to ActivitySummary
 */
export function activityToSummary(activity: Activity): ActivitySummary {
  return {
    distance: metersToKm(activity.distance),
    duration: activity.duration || 0,
    startTime: new Date(activity.startTimeGMT).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    endTime: new Date(activity.endTimeGMT).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    avgPace: msToPaceMinPerKm(activity.averageSpeed),
    avgSpeed: msToKmh(activity.averageSpeed),
    avgHeartRate: activity.averageHR || 0,
    maxHeartRate: activity.maxHR || 0,
    calories: activity.calories || 0,
    elevationGain: activity.elevationGain || 0,
    elevationLoss: activity.elevationLoss || 0,
  };
}

/**
 * Convert BigQuery Activity to PerformanceScores
 */
export function activityToScores(activity: Activity): PerformanceScores {
  // Training effects are already on 0-5 scale from BigQuery
  const aerobicScore = activity.aerobicTrainingEffect || 0;
  const anaerobicScore = activity.anaerobicTrainingEffect || 0;

  return {
    stamina: Math.round((activity.activityTrainingLoad || 0) / 3), // Rough conversion
    aerobicScore,
    anaerobicScore,
  };
}

/**
 * Convert BigQuery HR zones to HeartRateZone array
 */
export function activityToHeartRateZones(activity: Activity): HeartRateZone[] {
  if (!activity.hr_zones) return [];

  const zones = hrZonesToArray(activity.hr_zones);
  const maxHR = activity.maxHR || 180; // Fallback

  return zones.map((zone) => {
    const info = HR_ZONE_INFO[zone.zone];

    // Estimate HR ranges based on max HR and standard zones
    const minHR = Math.round(maxHR * (0.5 + zone.zone * 0.1));
    const maxZoneHR = Math.round(maxHR * (0.5 + (zone.zone + 1) * 0.1));

    return {
      zone: zone.zone as 1 | 2 | 3 | 4 | 5,
      name: info.name,
      color: info.color,
      percentage: Math.round(zone.percentage * 10) / 10,
      timeInZone: Math.round(zone.timeInZone),
      minHR,
      maxHR: maxZoneHR,
    };
  });
}

/**
 * Convert KilometerLap to ActivityInterval
 */
export function lapToInterval(lap: KilometerLap, index: number): ActivityInterval {
  const pace = msToPaceMinPerKm(lap.averageSpeed);

  // Determine dominant zone based on average HR
  let dominantZone: 1 | 2 | 3 | 4 | 5 = 2;
  if (lap.averageHR) {
    if (lap.averageHR < 120) dominantZone = 1;
    else if (lap.averageHR < 140) dominantZone = 2;
    else if (lap.averageHR < 160) dominantZone = 3;
    else if (lap.averageHR < 170) dominantZone = 4;
    else dominantZone = 5;
  }

  // Determine interval type based on lap index
  let type: 'warmup' | 'work' | 'recovery' | 'cooldown' | 'rest' = 'work';
  if (index === 0) type = 'warmup';

  return {
    id: lap.lapIndex,
    name: `Km ${lap.lapIndex}`,
    type,
    distance: metersToKm(lap.distance),
    duration: lap.duration,
    avgPace: pace,
    avgHeartRate: lap.averageHR,
    maxHeartRate: lap.maxHR,
    dominantZone,
    elevationGain: lap.elevationGain,
    startTime: index > 0 ? undefined : 0,
  };
}

/**
 * Convert KilometerLaps to ActivityInterval array
 */
export function lapsToIntervals(laps: KilometerLap[]): ActivityInterval[] {
  return laps.map((lap, index) => lapToInterval(lap, index));
}

/**
 * Generate mock time series from laps (simplified)
 */
export function lapsToTimeSeries(laps: KilometerLap[]): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  let cumulativeTime = 0;
  let cumulativeDistance = 0;
  let cumulativeAltitude = 50; // Start altitude

  laps.forEach((lap) => {
    const numPoints = 10; // Generate 10 points per lap
    const timeStep = lap.duration / numPoints;
    const distanceStep = metersToKm(lap.distance) / numPoints;
    const altitudeStep = (lap.elevationGain - lap.elevationLoss) / numPoints;

    for (let i = 0; i < numPoints; i++) {
      cumulativeTime += timeStep;
      cumulativeDistance += distanceStep;
      cumulativeAltitude += altitudeStep;

      points.push({
        timestamp: Math.round(cumulativeTime),
        distance: Math.round(cumulativeDistance * 100) / 100,
        heartRate: lap.averageHR + (Math.random() * 10 - 5), // Add variance
        pace: msToPaceMinPerKm(lap.averageSpeed),
        altitude: Math.round(cumulativeAltitude),
        speed: msToKmh(lap.averageSpeed),
      });
    }
  });

  return points;
}

/**
 * Convert BigQuery Activity to ActivityDetail
 */
export function activityToDetail(activity: Activity): ActivityDetail {
  const laps = activity.kilometer_laps || [];

  return {
    id: activity.activityId.toString(),
    title: activity.activityName,
    date: new Date(activity.startTimeGMT).toISOString().split('T')[0],
    type: activity.typeKey.includes('running') ? 'running' : 'cycling',
    location: extractLocation(activity.activityName),
    notes: undefined,
    summary: activityToSummary(activity),
    scores: activityToScores(activity),
    heartRateZones: activityToHeartRateZones(activity),
    intervals: lapsToIntervals(laps),
    timeSeries: lapsToTimeSeries(laps),
    playlist: [], // Not available in BigQuery data
  };
}

/**
 * Extract location from activity name (e.g., "Paris Course à pied" -> "Paris")
 */
function extractLocation(activityName: string): string | undefined {
  const match = activityName.match(/^([^-]+?)(?:\s+Course|\s+Vélo|\s+Running)?/i);
  return match ? match[1].trim() : undefined;
}
