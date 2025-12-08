import type {
  ActivityDetail,
  ActivityInterval,
  HeartRateZone,
  TimeSeriesPoint,
  PlaylistTrack,
} from "@/types/activity-detail";

// Génération de données temps réel réalistes pour une séance de fractionné
function generateTimeSeries(): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  let cumulativeDistance = 0;
  let currentAltitude = 50; // Altitude de départ en mètres

  // Intervalles avec leurs caractéristiques
  const intervals = [
    { duration: 600, pace: 6.0, hr: 125, type: "warmup" },      // 10min échauffement
    { duration: 300, pace: 4.2, hr: 165, type: "work" },        // 5min effort
    { duration: 120, pace: 7.0, hr: 135, type: "recovery" },    // 2min récup
    { duration: 300, pace: 4.1, hr: 168, type: "work" },        // 5min effort
    { duration: 120, pace: 7.0, hr: 138, type: "recovery" },    // 2min récup
    { duration: 300, pace: 4.0, hr: 172, type: "work" },        // 5min effort
    { duration: 120, pace: 7.0, hr: 140, type: "recovery" },    // 2min récup
    { duration: 600, pace: 6.2, hr: 120, type: "cooldown" },    // 10min retour calme
  ];

  let timestamp = 0;

  intervals.forEach((interval, intervalIndex) => {
    const steps = Math.floor(interval.duration / 15); // 1 point toutes les 15 secondes

    for (let i = 0; i < steps; i++) {
      const progress = i / steps;

      // Variation naturelle de la fréquence cardiaque
      const hrVariation = Math.sin(timestamp / 30) * 3 + Math.random() * 4 - 2;
      const heartRate = Math.round(interval.hr + hrVariation);

      // Variation de l'allure
      const paceVariation = Math.random() * 0.2 - 0.1;
      const pace = interval.pace + paceVariation;
      const speed = 60 / pace; // km/h

      // Distance parcourue (en km)
      const distanceIncrement = (speed / 3600) * 15; // distance en 15 secondes
      cumulativeDistance += distanceIncrement;

      // Variation d'altitude (légères montées/descentes)
      const altitudeChange = Math.sin(timestamp / 100) * 2 + Math.random() * 1 - 0.5;
      currentAltitude += altitudeChange;

      points.push({
        timestamp,
        distance: parseFloat(cumulativeDistance.toFixed(3)),
        heartRate,
        pace: parseFloat(pace.toFixed(2)),
        altitude: Math.round(currentAltitude),
        speed: parseFloat(speed.toFixed(2)),
      });

      timestamp += 15;
    }
  });

  return points;
}

// Données mock complètes
export const mockActivityDetail: ActivityDetail = {
  id: "1",
  title: "Fractionné matinal - 3x5min",
  date: "2024-12-07",
  type: "running",
  location: "Parc de Sceaux, France",
  notes: "Excellente séance ce matin ! Conditions idéales avec 12°C et ciel dégagé. Les jambes étaient encore un peu lourdes au début mais ça s'est bien passé après l'échauffement. Le dernier intervalle était difficile mais j'ai tenu le rythme. À noter : nouvelles chaussures Pegasus 40 très confortables. Objectif atteint : maintenir sub-4:15 sur les efforts. Prochaine fois : essayer 4x5min si la récupération est bonne.",

  summary: {
    distance: 8.2,
    duration: 3120, // 52 minutes
    startTime: "07:32",
    endTime: "08:24",
    avgPace: 6.34,
    avgSpeed: 9.42,
    avgHeartRate: 148,
    maxHeartRate: 176,
    calories: 512,
    elevationGain: 85,
    elevationLoss: 78,
  },

  scores: {
    stamina: 72,
    aerobicScore: 3.8,
    anaerobicScore: 4.2,
  },

  heartRateZones: [
    {
      zone: 1,
      name: "Récupération",
      color: "#9CA3AF",
      percentage: 8,
      timeInZone: 250,
      minHR: 0,
      maxHR: 120,
    },
    {
      zone: 2,
      name: "Endurance",
      color: "#60A5FA",
      percentage: 35,
      timeInZone: 1092,
      minHR: 120,
      maxHR: 140,
    },
    {
      zone: 3,
      name: "Tempo",
      color: "#22C55E",
      percentage: 15,
      timeInZone: 468,
      minHR: 140,
      maxHR: 155,
    },
    {
      zone: 4,
      name: "Seuil",
      color: "#F97316",
      percentage: 32,
      timeInZone: 998,
      minHR: 155,
      maxHR: 170,
    },
    {
      zone: 5,
      name: "VO2Max",
      color: "#EF4444",
      percentage: 10,
      timeInZone: 312,
      minHR: 170,
      maxHR: 200,
    },
  ],

  intervals: [
    {
      id: 1,
      name: "Échauffement",
      type: "warmup",
      distance: 2.0,
      duration: 600,
      avgPace: 6.0,
      avgHeartRate: 125,
      maxHeartRate: 132,
      dominantZone: 2,
      elevationGain: 15,
      startTime: 0,
    },
    {
      id: 2,
      name: "Effort 1",
      type: "work",
      distance: 1.19,
      duration: 300,
      avgPace: 4.2,
      avgHeartRate: 165,
      maxHeartRate: 172,
      dominantZone: 4,
      elevationGain: 8,
      startTime: 600,
    },
    {
      id: 3,
      name: "Récup 1",
      type: "recovery",
      distance: 0.29,
      duration: 120,
      avgPace: 7.0,
      avgHeartRate: 135,
      maxHeartRate: 142,
      dominantZone: 2,
      elevationGain: 2,
      startTime: 900,
    },
    {
      id: 4,
      name: "Effort 2",
      type: "work",
      distance: 1.22,
      duration: 300,
      avgPace: 4.1,
      avgHeartRate: 168,
      maxHeartRate: 174,
      dominantZone: 4,
      elevationGain: 12,
      startTime: 1020,
    },
    {
      id: 5,
      name: "Récup 2",
      type: "recovery",
      distance: 0.29,
      duration: 120,
      avgPace: 7.0,
      avgHeartRate: 138,
      maxHeartRate: 145,
      dominantZone: 2,
      elevationGain: 3,
      startTime: 1320,
    },
    {
      id: 6,
      name: "Effort 3",
      type: "work",
      distance: 1.25,
      duration: 300,
      avgPace: 4.0,
      avgHeartRate: 172,
      maxHeartRate: 176,
      dominantZone: 5,
      elevationGain: 18,
      startTime: 1440,
    },
    {
      id: 7,
      name: "Récup 3",
      type: "recovery",
      distance: 0.29,
      duration: 120,
      avgPace: 7.0,
      avgHeartRate: 140,
      maxHeartRate: 148,
      dominantZone: 3,
      elevationGain: 2,
      startTime: 1740,
    },
    {
      id: 8,
      name: "Retour au calme",
      type: "cooldown",
      distance: 1.67,
      duration: 600,
      avgPace: 6.2,
      avgHeartRate: 120,
      maxHeartRate: 128,
      dominantZone: 2,
      elevationGain: 8,
      startTime: 1860,
    },
  ],

  timeSeries: generateTimeSeries(),

  playlist: [
    {
      id: "1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: 200,
      playedAt: 0,
    },
    {
      id: "2",
      title: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: 203,
      playedAt: 200,
    },
    {
      id: "3",
      title: "Don't Start Now",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: 183,
      playedAt: 403,
    },
    {
      id: "4",
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: 174,
      playedAt: 586,
    },
    {
      id: "5",
      title: "Physical",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: 193,
      playedAt: 760,
    },
    {
      id: "6",
      title: "Rain On Me",
      artist: "Lady Gaga, Ariana Grande",
      album: "Chromatica",
      duration: 182,
      playedAt: 953,
    },
    {
      id: "7",
      title: "Stupid Love",
      artist: "Lady Gaga",
      album: "Chromatica",
      duration: 193,
      playedAt: 1135,
    },
    {
      id: "8",
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      duration: 215,
      playedAt: 1328,
    },
    {
      id: "9",
      title: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: 178,
      playedAt: 1543,
    },
    {
      id: "10",
      title: "Peaches",
      artist: "Justin Bieber ft. Daniel Caesar",
      album: "Justice",
      duration: 198,
      playedAt: 1721,
    },
    {
      id: "11",
      title: "Positions",
      artist: "Ariana Grande",
      album: "Positions",
      duration: 172,
      playedAt: 1919,
    },
    {
      id: "12",
      title: "Therefore I Am",
      artist: "Billie Eilish",
      album: "Therefore I Am",
      duration: 173,
      playedAt: 2091,
    },
    {
      id: "13",
      title: "Mood",
      artist: "24kGoldn ft. iann dior",
      album: "El Dorado",
      duration: 140,
      playedAt: 2264,
    },
    {
      id: "14",
      title: "Dynamite",
      artist: "BTS",
      album: "BE",
      duration: 199,
      playedAt: 2404,
    },
    {
      id: "15",
      title: "Heat Waves",
      artist: "Glass Animals",
      album: "Dreamland",
      duration: 238,
      playedAt: 2603,
    },
  ],
};

// Export multiple activities for future use
export const mockActivities: Record<string, ActivityDetail> = {
  "1": mockActivityDetail,
};
