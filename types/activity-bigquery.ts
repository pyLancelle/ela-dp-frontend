// Auto-generated from BigQuery data
// Generated on 2025-12-08T23:01:32.499Z

interface FastestSplits {
  fastestSplit_1000: number | null;
  fastestSplit_1609: number | null;
  fastestSplit_5000: number | null;
  fastestSplit_10000: number | null;
  fastestSplit_21098: number | null;
  fastestSplit_42195: number | null;
}

interface HRZones {
  hrTimeInZone_1: number | null;
  hrTimeInZone_2: number | null;
  hrTimeInZone_3: number | null;
  hrTimeInZone_4: number | null;
  hrTimeInZone_5: number | null;
}

interface PowerZones {
  powerTimeInZone_1: number | null;
  powerTimeInZone_2: number | null;
  powerTimeInZone_3: number | null;
  powerTimeInZone_4: number | null;
  powerTimeInZone_5: number | null;
}

interface KilometerLap {
  lapIndex: number | null;
  startTimeGMT: string | null;
  distance: number | null;
  duration: number | null;
  averageSpeed: number | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
}

interface TrainingInterval {
  startTimeGMT: string | null;
  distance: number | null;
  duration: number | null;
  averageSpeed: number | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
}

interface Activity {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  endTimeGMT: string;
  typeKey: string;
  distance: number | null;
  duration: number | null;
  elapsedDuration: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
  averageSpeed: number | null;
  hasPolyline: boolean | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  aerobicTrainingEffect: number | null;
  anaerobicTrainingEffect: number | null;
  minElevation: number | null;
  maxElevation: number | null;
  activityTrainingLoad: number | null;
  fastestSplits: FastestSplits | null;
  hr_zones: HRZones | null;
  power_zones: PowerZones | null;
  kilometer_laps: KilometerLap[] | null;
  training_intervals: TrainingInterval[] | null;
}
