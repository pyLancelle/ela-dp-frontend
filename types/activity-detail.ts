// Types d'activité
export type ActivityType = "running" | "cycling" | "swimming" | "hiking" | "trail";

// Type d'intervalle
export type IntervalType = "warmup" | "work" | "recovery" | "cooldown" | "rest";

// Résumé global de l'activité
export interface ActivitySummary {
  distance: number;           // km
  duration: number;           // secondes
  startTime: string;          // "07:32"
  endTime: string;            // "08:45"
  avgPace: number;            // min/km (ex: 5.5 = 5'30")
  avgSpeed: number;           // km/h
  avgHeartRate: number;       // bpm
  maxHeartRate: number;       // bpm
  calories: number;           // kcal
  elevationGain: number;      // m
  elevationLoss: number;      // m
}

// Scores Garmin
export interface PerformanceScores {
  stamina: number;            // 0-100
  aerobicScore: number;       // 0-5 (ou 0-100 selon format)
  anaerobicScore: number;     // 0-5 (ou 0-100 selon format)
}

// Zone cardiaque
export interface HeartRateZone {
  zone: 1 | 2 | 3 | 4 | 5;
  name: string;               // "Récupération", "Endurance", "Tempo", "Seuil", "VO2Max"
  color: string;              // Code couleur pour le graphique
  percentage: number;         // 0-100 (pourcentage du temps dans cette zone)
  timeInZone: number;         // secondes
  minHR: number;              // BPM min de la zone
  maxHR: number;              // BPM max de la zone
}

// Intervalle de course
export interface ActivityInterval {
  id: number;
  name: string;               // "Échauffement", "Effort 1", "Récup 1", etc.
  type: IntervalType;
  distance: number;           // km
  duration: number;           // secondes
  avgPace: number;            // min/km
  avgHeartRate: number;       // bpm
  maxHeartRate: number;       // bpm
  dominantZone: 1 | 2 | 3 | 4 | 5;
  elevationGain: number;      // m
  startTime?: number;         // secondes depuis le début de l'activité
}

// Point de données temps réel (pour graphiques ligne)
export interface TimeSeriesPoint {
  timestamp: number;          // Unix ms
  distance: number;           // km cumulés
  heartRate: number;          // bpm
  pace: number | null;        // min/km instantané (null lors des pauses)
  altitude: number;           // m
  speed: number;              // km/h
}

// Track musical
export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;           // secondes
  playedAt: number;           // secondes depuis le début de l'activité
  albumArt?: string;          // URL image
}

// Activité complète
export interface ActivityDetail {
  id: string;
  title: string;
  date: string;               // "2024-01-15"
  type: ActivityType;
  location?: string;
  notes?: string;             // Notes de l'utilisateur sur l'activité
  coordinates?: [number, number][];  // [lat, lng][]

  summary: ActivitySummary;
  scores: PerformanceScores;
  heartRateZones: HeartRateZone[];
  intervals: ActivityInterval[];
  timeSeries: TimeSeriesPoint[];
  playlist: PlaylistTrack[];
}
