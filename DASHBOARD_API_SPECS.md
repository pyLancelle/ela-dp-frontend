# Dashboard API - Spécifications Complètes

## 📋 Vue d'ensemble

Ce document définit les contrats d'API pour alimenter le Dashboard principal de l'application.

**Sources de données :** Garmin (santé/running) + Spotify (musique) stockées en base de données.

### 🗄️ Vues BigQuery créées

Les données sont pré-agrégées et formatées dans 3 vues BigQuery dédiées :

1. **`pct_homepage__health_dashboard`** → Données Santé & Bien-être
2. **`pct_homepage__music_dashboard`** → Données Musique (Spotify)
3. **`pct_homepage__running_dashboard`** → Données Course à pied

**Avantages :**
- ✅ Calculs complexes déjà effectués côté base de données
- ✅ Performances optimales (pas de jointures complexes à l'exécution)
- ✅ API routes ultra-simples (simple `SELECT *`)
- ✅ Maintenance centralisée (logique métier dans les vues SQL)

---

## 🎯 Stratégie d'API Recommandée : **Vue par Périmètre**

### Architecture proposée : 3 endpoints principaux

```
GET /api/dashboard/health    → Toutes les données Santé & Bien-être
GET /api/dashboard/music     → Toutes les données Musique (Spotify)
GET /api/dashboard/running   → Toutes les données Course à pied
```

### Pourquoi cette approche ?

✅ **Avantages :**
- **3 appels HTTP** au lieu de 24 (une par carte)
- Chargement **indépendant par section** (santé peut charger pendant que musique est en erreur)
- **Mise en cache granulaire** par domaine (TTL différent pour chaque périmètre)
- **Cohérence des données** (les données d'un même périmètre sont calculées ensemble)
- **Simplicité frontend** (3 `fetch` au lieu de 24)
- **Évolutivité** (facile d'ajouter un nouveau périmètre sans refactor)

❌ **Alternatives écartées :**
- **1 vue globale** (`/api/dashboard`) : trop monolithique, impossible de charger partiellement
- **1 vue par carte** (24 routes) : waterfall HTTP, complexité inutile, surcharge réseau

---

## 🏥 ENDPOINT 1 : Santé & Bien-être

### `GET /api/dashboard/health`

#### Response (200 OK)

```typescript
interface HealthDashboardData {
  // Timestamp de génération des données
  generatedAt: string;  // ISO 8601 (ex: "2025-11-16T14:30:00Z")

  // 1. Indicateurs Santé (4 gauges)
  indicators: {
    sleepScore: {
      value: number;        // 0-100 (ex: 88)
      date: string;         // ISO 8601 dernière nuit
      percentage: number;   // value/100 (ex: 0.88)
    };
    hrv: {
      value: number;        // Millisecondes (ex: 58)
      date: string;         // ISO 8601
      baseline: number;     // Baseline perso (ex: 52)
      percentage: number;   // value/100 (ex: 0.58)
    };
    restingHeartRate: {
      value: number;        // BPM (ex: 52)
      date: string;         // ISO 8601
      percentage: number;   // value/100 (ex: 0.52)
    };
    bodyBattery: {
      value: number;        // 0-100 (ex: 75)
      date: string;         // ISO 8601
      percentage: number;   // value/100 (ex: 0.75)
    };
  };

  // 2. Sommeil 7 derniers jours (bar chart)
  sleepWeek: {
    day: string;          // 'L', 'M', 'M', 'J', 'V', 'S', 'D'
    date: string;         // ISO 8601 (ex: "2025-11-09")
    score: number;        // 0-100 (ex: 88)
    isLow: boolean;       // true si score < 60
  }[];

  // 3. HRV 7 derniers jours (bar chart avec baseline)
  hrvWeek: {
    current: number;      // Valeur actuelle (ex: 58)
    baseline: number;     // Baseline (ex: 52)
    daily: {
      date: string;       // ISO 8601
      value: number;      // HRV en ms (ex: 61)
      displayHeight: number; // 0-100 pour affichage (ex: 76)
      isAboveBaseline: boolean; // true si >= baseline
    }[];
  };

  // 4. Poids (tendance 30 jours)
  weight: {
    current: {
      value: number;      // kg avec 1 décimale (ex: 72.5)
      date: string;       // ISO 8601
    };
    trend: {
      change: number;     // kg sur 30j, peut être négatif (ex: -1.2)
      percentChange: number; // % (ex: -1.6)
      direction: "up" | "down" | "stable";
    };
    target: {
      value: number;      // Objectif en kg (ex: 71.0)
      remaining: number;  // Reste à perdre/gagner (ex: -1.5)
    };
    chartPoints: number[]; // 30 valeurs normalisées 0-100 pour polyline
  };

  // 5. Stress quotidien
  stress: {
    value: number;        // 0-100 (ex: 32)
    date: string;         // ISO 8601 aujourd'hui
    level: "Faible" | "Modéré" | "Élevé";
    color: "green" | "orange" | "red";
  };

  // 6. Phases de sommeil (timeline détaillée)
  sleepTimeline: {
    totalDuration: string; // Format "7h 32m"
    date: string;         // ISO 8601 de la nuit
    stages: {
      type: "awake" | "light" | "deep" | "rem";
      duration: number;   // Minutes (ex: 126)
      startTime: string;  // HH:mm (ex: "23:15")
      endTime: string;    // HH:mm (ex: "01:21")
      widthPercentage: number; // % de la timeline (ex: 27.9)
    }[];
    summary: {
      deep: number;       // Total minutes sommeil profond (ex: 126)
      rem: number;        // Total minutes REM (ex: 113)
      light: number;      // Total minutes léger (ex: 181)
      awake: number;      // Total minutes éveillé (ex: 32)
    };
  };
}
```

#### Exemple de réponse

```json
{
  "generatedAt": "2025-11-16T14:30:00Z",
  "indicators": {
    "sleepScore": {
      "value": 88,
      "date": "2025-11-16T06:30:00Z",
      "percentage": 0.88
    },
    "hrv": {
      "value": 58,
      "date": "2025-11-16T07:00:00Z",
      "baseline": 52,
      "percentage": 0.58
    },
    "restingHeartRate": {
      "value": 52,
      "date": "2025-11-16T07:00:00Z",
      "percentage": 0.52
    },
    "bodyBattery": {
      "value": 75,
      "date": "2025-11-16T14:30:00Z",
      "percentage": 0.75
    }
  },
  "sleepWeek": [
    { "day": "L", "date": "2025-11-10", "score": 55, "isLow": false },
    { "day": "M", "date": "2025-11-11", "score": 75, "isLow": false },
    { "day": "M", "date": "2025-11-12", "score": 38, "isLow": true },
    { "day": "J", "date": "2025-11-13", "score": 78, "isLow": false },
    { "day": "V", "date": "2025-11-14", "score": 69, "isLow": false },
    { "day": "S", "date": "2025-11-15", "score": 85, "isLow": false },
    { "day": "D", "date": "2025-11-16", "score": 88, "isLow": false }
  ],
  "hrvWeek": {
    "current": 58,
    "baseline": 52,
    "daily": [
      { "date": "2025-11-10", "value": 52, "displayHeight": 65, "isAboveBaseline": true },
      { "date": "2025-11-11", "value": 48, "displayHeight": 60, "isAboveBaseline": false },
      { "date": "2025-11-12", "value": 55, "displayHeight": 68, "isAboveBaseline": true },
      { "date": "2025-11-13", "value": 61, "displayHeight": 76, "isAboveBaseline": true },
      { "date": "2025-11-14", "value": 54, "displayHeight": 67, "isAboveBaseline": true },
      { "date": "2025-11-15", "value": 50, "displayHeight": 62, "isAboveBaseline": false },
      { "date": "2025-11-16", "value": 58, "displayHeight": 72, "isAboveBaseline": true }
    ]
  },
  "weight": {
    "current": {
      "value": 72.5,
      "date": "2025-11-16T08:00:00Z"
    },
    "trend": {
      "change": -1.2,
      "percentChange": -1.6,
      "direction": "down"
    },
    "target": {
      "value": 71.0,
      "remaining": -1.5
    },
    "chartPoints": [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94]
  },
  "stress": {
    "value": 32,
    "date": "2025-11-16T14:30:00Z",
    "level": "Faible",
    "color": "green"
  },
  "sleepTimeline": {
    "totalDuration": "7h 32m",
    "date": "2025-11-15T23:00:00Z",
    "stages": [
      {
        "type": "awake",
        "duration": 5,
        "startTime": "23:00",
        "endTime": "23:05",
        "widthPercentage": 1.1
      },
      {
        "type": "light",
        "duration": 45,
        "startTime": "23:05",
        "endTime": "23:50",
        "widthPercentage": 10.0
      },
      {
        "type": "deep",
        "duration": 80,
        "startTime": "23:50",
        "endTime": "01:10",
        "widthPercentage": 17.7
      },
      {
        "type": "light",
        "duration": 75,
        "startTime": "01:10",
        "endTime": "02:25",
        "widthPercentage": 16.5
      },
      {
        "type": "rem",
        "duration": 113,
        "startTime": "02:25",
        "endTime": "04:18",
        "widthPercentage": 25.0
      },
      {
        "type": "light",
        "duration": 61,
        "startTime": "04:18",
        "endTime": "05:19",
        "widthPercentage": 13.5
      },
      {
        "type": "awake",
        "duration": 12,
        "startTime": "05:19",
        "endTime": "05:31",
        "widthPercentage": 2.6
      },
      {
        "type": "deep",
        "duration": 46,
        "startTime": "05:31",
        "endTime": "06:17",
        "widthPercentage": 10.2
      },
      {
        "type": "awake",
        "duration": 15,
        "startTime": "06:17",
        "endTime": "06:32",
        "widthPercentage": 3.3
      }
    ],
    "summary": {
      "deep": 126,
      "rem": 113,
      "light": 181,
      "awake": 32
    }
  }
}
```

#### Codes de réponse

- **200 OK** : Données récupérées avec succès
- **500 Internal Server Error** : Erreur serveur (base de données, Garmin API, etc.)

#### Notes d'implémentation

- **Cache recommandé :** 5 minutes pour indicateurs temps réel, 1 heure pour sommeil/HRV
- **Source :** Tables Garmin en base de données
- **Calculs côté serveur :**
  - `percentage` pour les indicateurs
  - `isLow` pour le sommeil (< 60)
  - `displayHeight` pour HRV (normalisation)
  - `widthPercentage` pour les phases de sommeil
  - `direction` pour le poids (< -0.5 = down, > 0.5 = up, sinon stable)

---

## 🎵 ENDPOINT 2 : Musique (Spotify)

### `GET /api/dashboard/music`

#### Query Parameters

| Paramètre | Type | Requis | Valeur par défaut | Description |
|-----------|------|--------|-------------------|-------------|
| `period` | string | Non | `last_7_days` | Période de référence |

**Valeurs acceptées pour `period` :**
- `yesterday`
- `last_7_days` (défaut)
- `last_30_days`
- `last_365_days`
- `all_time`

#### Response (200 OK)

```typescript
interface MusicDashboardData {
  generatedAt: string;  // ISO 8601
  period: string;       // La période demandée

  // 1. Temps d'écoute hebdomadaire (7 derniers jours)
  listeningTime: {
    averagePerDay: string; // Format "4h 12m"
    days: {
      date: string;       // ISO 8601 (ex: "2025-11-11")
      day: string;        // 'L', 'M', 'M', 'J', 'V', 'S', 'D'
      duration: number;   // Minutes totales (ex: 195)
      formatted: string;  // Format "3h 15m"
      heightPercentage: number; // 0-100 pour barre (ex: 65)
    }[];
  };

  // 2. Top 10 Artistes
  topArtists: {
    rank: number;         // Position 1-10
    name: string;         // Nom de l'artiste
    trackCount: number;   // Nombre de titres différents écoutés
    totalDuration: string; // Format "12h 34m"
    playCount: number;    // Nombre de lectures
    imageUrl: string | null; // URL pochette (peut être null)
    externalUrl: string | null; // Lien Spotify (peut être null)
  }[];

  // 3. Top 10 Titres
  topTracks: {
    rank: number;         // Position 1-10
    name: string;         // Titre de la chanson
    artistName: string;   // Nom de l'artiste
    totalDuration: string; // Format "3h 45m"
    playCount: number;    // Nombre de lectures
    imageUrl: string | null; // URL pochette album (peut être null)
    externalUrl: string | null; // Lien Spotify (peut être null)
  }[];
}
```

#### Exemple de réponse

```json
{
  "generatedAt": "2025-11-16T14:30:00Z",
  "period": "last_7_days",
  "listeningTime": {
    "averagePerDay": "4h 12m",
    "days": [
      {
        "date": "2025-11-10",
        "day": "L",
        "duration": 195,
        "formatted": "3h 15m",
        "heightPercentage": 65
      },
      {
        "date": "2025-11-11",
        "day": "M",
        "duration": 330,
        "formatted": "5h 30m",
        "heightPercentage": 92
      },
      {
        "date": "2025-11-12",
        "day": "M",
        "duration": 165,
        "formatted": "2h 45m",
        "heightPercentage": 46
      },
      {
        "date": "2025-11-13",
        "day": "J",
        "duration": 260,
        "formatted": "4h 20m",
        "heightPercentage": 72
      },
      {
        "date": "2025-11-14",
        "day": "V",
        "duration": 230,
        "formatted": "3h 50m",
        "heightPercentage": 64
      },
      {
        "date": "2025-11-15",
        "day": "S",
        "duration": 360,
        "formatted": "6h 00m",
        "heightPercentage": 100
      },
      {
        "date": "2025-11-16",
        "day": "D",
        "duration": 210,
        "formatted": "3h 30m",
        "heightPercentage": 58
      }
    ]
  },
  "topArtists": [
    {
      "rank": 1,
      "name": "The Weeknd",
      "trackCount": 42,
      "totalDuration": "12h 34m",
      "playCount": 342,
      "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb",
      "externalUrl": "https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ"
    },
    {
      "rank": 2,
      "name": "Daft Punk",
      "trackCount": 38,
      "totalDuration": "10h 22m",
      "playCount": 289,
      "imageUrl": "https://i.scdn.co/image/ab6761610000e5eb0672b0e8d72a0afa9d4581c9",
      "externalUrl": "https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi"
    }
  ],
  "topTracks": [
    {
      "rank": 1,
      "name": "Blinding Lights",
      "artistName": "The Weeknd",
      "totalDuration": "3h 45m",
      "playCount": 68,
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b273214f3cf1cbe7139c1e26ffbb",
      "externalUrl": "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
    },
    {
      "rank": 2,
      "name": "One More Time",
      "artistName": "Daft Punk",
      "totalDuration": "3h 12m",
      "playCount": 52,
      "imageUrl": "https://i.scdn.co/image/ab67616d0000b2730672b0e8d72a0afa9d4581c9",
      "externalUrl": "https://open.spotify.com/track/0DiWol3AO6WpXZgp0goxAV"
    }
  ]
}
```

#### Codes de réponse

- **200 OK** : Données récupérées avec succès
- **400 Bad Request** : Paramètre `period` invalide
- **500 Internal Server Error** : Erreur serveur

#### Notes d'implémentation

- **Cache recommandé :** 1 heure (données peu volatiles)
- **Source :** Tables BigQuery existantes `pct_classement__top_*`
- **Calculs côté serveur :**
  - `formatted` : conversion minutes → "Xh Ym"
  - `heightPercentage` : normalisation par rapport au max de la semaine
  - `averagePerDay` : moyenne des 7 jours
- **Tri :** Par `playCount` DESC puis `totalDuration` DESC

---

## 🏃 ENDPOINT 3 : Course à pied (Running)

### `GET /api/dashboard/running`

#### Response (200 OK)

```typescript
interface RunningDashboardData {
  generatedAt: string;  // ISO 8601

  // 1. Stats hebdomadaires + Aérobie/Anaérobie (7 jours)
  weeklyStats: {
    totalDistance: number;    // km avec 1 décimale (ex: 18.5)
    sessionCount: number;     // Nombre de courses (ex: 4)
    averagePerSession: number; // km/session (ex: 4.6)
    goalStatus: "achieved" | "in_progress" | "not_achieved";
    weeklyGoal: number;       // Objectif hebdo en km (ex: 15)

    daily: {
      date: string;       // ISO 8601
      day: string;        // 'L', 'M', 'M', 'J', 'V', 'S', 'D'
      distance: number;   // km (0 si pas de course)
      aerobicScore: number; // 0-100 (0 si pas de course)
      anaerobicScore: number; // 0-100 (0 si pas de course)
    }[];

    maxAerobicChange: number;   // Ex: +5
    maxAnaerobicChange: number; // Ex: -5
  };

  // 2. Volume hebdomadaire (10 dernières semaines)
  weeklyVolume: {
    weeks: {
      weekNumber: number;   // Semaine ISO (1-52)
      year: number;         // Année
      totalKm: number;      // Distance totale (ex: 22.0)
      startDate: string;    // ISO 8601 lundi
      endDate: string;      // ISO 8601 dimanche
      isCurrent: boolean;   // true pour semaine en cours
    }[];
    average: number;        // Moyenne 10 semaines (ex: 28.7)
    max: number;            // Maximum 10 semaines (ex: 40.0)
  };

  // 3. Status d'entraînement
  trainingStatus: {
    status: "Productif" | "Maintien" | "Récupération" | "Surcharge" | "Déconditionnement";
    color: "green" | "blue" | "yellow" | "orange" | "red";
    icon: "CheckCircle2" | "Activity" | "Moon" | "AlertTriangle" | "TrendingDown";
    updatedAt: string;    // ISO 8601
    description: string;  // Description textuelle
  };

  // 4. Ratio de charge (Acute:Chronic Workload)
  workloadRatio: {
    ratio: number;        // Valeur décimale (ex: 1.15)
    acuteLoad: number;    // Charge 7j (ex: 92)
    chronicLoad: number;  // Charge 28j (ex: 80)
    zone: "safe" | "low" | "high";
    safeZone: {
      min: number;        // Ex: 0.8
      max: number;        // Ex: 1.3
    };
    positionPercentage: number; // Position sur échelle 0-2 (ex: 57.5)
  };

  // 5. VO2 Max (tendance 6 mois)
  vo2max: {
    current: number;      // ml/kg/min (ex: 54)
    previousMonth: number; // Valeur il y a 1 mois (ex: 52)
    change: number;       // Variation (ex: +2)
    trend: "up" | "down" | "stable";

    history: {
      date: string;       // ISO 8601 (1er du mois)
      value: number;      // VO2 Max ce mois-là
    }[];                  // 6 derniers mois
  };

  // 6. Prédictions courses
  predictions: {
    distance: "5K" | "10K" | "Semi-Marathon" | "Marathon";
    predictedTime: string;  // Format "20:25" ou "1:32:45"
    previousPrediction: string; // Prédiction il y a 1 mois
    improvement: string;    // Format "-1:15" ou "+0:30"
    improvementSeconds: number; // Secondes (négatif = amélioration)
    trend: "improving" | "stable" | "declining";
  }[];

  // 7. Kilométrage annuel (comparaison années)
  annualMileage: {
    current: {
      year: number;       // Ex: 2025
      totalKm: number;    // Total à date (ex: 215.0)
      isCurrent: true;
    };
    previous: {
      year: number;       // Ex: 2024
      totalKm: number;    // Total au même jour (ex: 195.0)
      isCurrent: false;
    };
    difference: {
      km: number;         // Différence absolue (ex: 20.0)
      percentage: number; // % (ex: 10.3)
      trend: "up" | "down" | "equal";
    };
    currentWidthPercentage: number; // Largeur barre 2025 (ex: 100)
    previousWidthPercentage: number; // Largeur barre 2024 (ex: 90.7)
  };

  // 8. Progression annuelle (graphique cumulé)
  annualProgress: {
    currentYear: {
      year: number;       // Ex: 2025
      lastMonthWithData: number; // Dernier mois avec données (1-12)
      data: {
        month: number;    // 1-12
        monthName: string; // 'Janvier', 'Février', etc.
        cumulativeKm: number; // Km cumulés depuis janvier
      }[];                // 12 mois
    };
    previousYear: {
      year: number;       // Ex: 2024
      data: {
        month: number;
        monthName: string;
        cumulativeKm: number;
      }[];                // 12 mois (année complète)
    };
  };
}
```

#### Exemple de réponse

```json
{
  "generatedAt": "2025-11-16T14:30:00Z",
  "weeklyStats": {
    "totalDistance": 18.5,
    "sessionCount": 4,
    "averagePerSession": 4.6,
    "goalStatus": "achieved",
    "weeklyGoal": 15,
    "daily": [
      {
        "date": "2025-11-10",
        "day": "L",
        "distance": 0,
        "aerobicScore": 0,
        "anaerobicScore": 0
      },
      {
        "date": "2025-11-11",
        "day": "M",
        "distance": 5.2,
        "aerobicScore": 85,
        "anaerobicScore": 15
      },
      {
        "date": "2025-11-12",
        "day": "M",
        "distance": 0,
        "aerobicScore": 0,
        "anaerobicScore": 0
      },
      {
        "date": "2025-11-13",
        "day": "J",
        "distance": 4.8,
        "aerobicScore": 78,
        "anaerobicScore": 22
      },
      {
        "date": "2025-11-14",
        "day": "V",
        "distance": 8.5,
        "aerobicScore": 92,
        "anaerobicScore": 38
      },
      {
        "date": "2025-11-15",
        "day": "S",
        "distance": 0,
        "aerobicScore": 0,
        "anaerobicScore": 0
      },
      {
        "date": "2025-11-16",
        "day": "D",
        "distance": 0,
        "aerobicScore": 0,
        "anaerobicScore": 0
      }
    ],
    "maxAerobicChange": 5,
    "maxAnaerobicChange": -5
  },
  "weeklyVolume": {
    "weeks": [
      {
        "weekNumber": 36,
        "year": 2025,
        "totalKm": 22.0,
        "startDate": "2025-09-08",
        "endDate": "2025-09-14",
        "isCurrent": false
      },
      {
        "weekNumber": 37,
        "year": 2025,
        "totalKm": 28.0,
        "startDate": "2025-09-15",
        "endDate": "2025-09-21",
        "isCurrent": false
      },
      {
        "weekNumber": 46,
        "year": 2025,
        "totalKm": 18.5,
        "startDate": "2025-11-10",
        "endDate": "2025-11-16",
        "isCurrent": true
      }
    ],
    "average": 28.7,
    "max": 40.0
  },
  "trainingStatus": {
    "status": "Productif",
    "color": "green",
    "icon": "CheckCircle2",
    "updatedAt": "2025-11-16T07:00:00Z",
    "description": "Votre entraînement maintient votre forme et améliore vos performances."
  },
  "workloadRatio": {
    "ratio": 1.15,
    "acuteLoad": 92,
    "chronicLoad": 80,
    "zone": "safe",
    "safeZone": {
      "min": 0.8,
      "max": 1.3
    },
    "positionPercentage": 57.5
  },
  "vo2max": {
    "current": 54,
    "previousMonth": 52,
    "change": 2,
    "trend": "up",
    "history": [
      { "date": "2025-06-01", "value": 48 },
      { "date": "2025-07-01", "value": 49 },
      { "date": "2025-08-01", "value": 50 },
      { "date": "2025-09-01", "value": 51 },
      { "date": "2025-10-01", "value": 52 },
      { "date": "2025-11-01", "value": 54 }
    ]
  },
  "predictions": [
    {
      "distance": "5K",
      "predictedTime": "20:25",
      "previousPrediction": "21:40",
      "improvement": "-1:15",
      "improvementSeconds": -75,
      "trend": "improving"
    },
    {
      "distance": "10K",
      "predictedTime": "42:15",
      "previousPrediction": "44:45",
      "improvement": "-2:30",
      "improvementSeconds": -150,
      "trend": "improving"
    },
    {
      "distance": "Semi-Marathon",
      "predictedTime": "1:32:45",
      "previousPrediction": "1:38:00",
      "improvement": "-5:15",
      "improvementSeconds": -315,
      "trend": "improving"
    },
    {
      "distance": "Marathon",
      "predictedTime": "3:18:30",
      "previousPrediction": "3:30:50",
      "improvement": "-12:20",
      "improvementSeconds": -740,
      "trend": "improving"
    }
  ],
  "annualMileage": {
    "current": {
      "year": 2025,
      "totalKm": 215.0,
      "isCurrent": true
    },
    "previous": {
      "year": 2024,
      "totalKm": 195.0,
      "isCurrent": false
    },
    "difference": {
      "km": 20.0,
      "percentage": 10.3,
      "trend": "up"
    },
    "currentWidthPercentage": 100,
    "previousWidthPercentage": 90.7
  },
  "annualProgress": {
    "currentYear": {
      "year": 2025,
      "lastMonthWithData": 8,
      "data": [
        { "month": 1, "monthName": "Janvier", "cumulativeKm": 0 },
        { "month": 2, "monthName": "Février", "cumulativeKm": 18 },
        { "month": 3, "monthName": "Mars", "cumulativeKm": 42 },
        { "month": 4, "monthName": "Avril", "cumulativeKm": 68 },
        { "month": 5, "monthName": "Mai", "cumulativeKm": 95 },
        { "month": 6, "monthName": "Juin", "cumulativeKm": 125 },
        { "month": 7, "monthName": "Juillet", "cumulativeKm": 158 },
        { "month": 8, "monthName": "Août", "cumulativeKm": 189 },
        { "month": 9, "monthName": "Septembre", "cumulativeKm": 215 },
        { "month": 10, "monthName": "Octobre", "cumulativeKm": 215 },
        { "month": 11, "monthName": "Novembre", "cumulativeKm": 215 },
        { "month": 12, "monthName": "Décembre", "cumulativeKm": 215 }
      ]
    },
    "previousYear": {
      "year": 2024,
      "data": [
        { "month": 1, "monthName": "Janvier", "cumulativeKm": 0 },
        { "month": 2, "monthName": "Février", "cumulativeKm": 15 },
        { "month": 3, "monthName": "Mars", "cumulativeKm": 38 },
        { "month": 4, "monthName": "Avril", "cumulativeKm": 62 },
        { "month": 5, "monthName": "Mai", "cumulativeKm": 88 },
        { "month": 6, "monthName": "Juin", "cumulativeKm": 115 },
        { "month": 7, "monthName": "Juillet", "cumulativeKm": 145 },
        { "month": 8, "monthName": "Août", "cumulativeKm": 172 },
        { "month": 9, "monthName": "Septembre", "cumulativeKm": 195 },
        { "month": 10, "monthName": "Octobre", "cumulativeKm": 221 },
        { "month": 11, "monthName": "Novembre", "cumulativeKm": 248 },
        { "month": 12, "monthName": "Décembre", "cumulativeKm": 278 }
      ]
    }
  }
}
```

#### Codes de réponse

- **200 OK** : Données récupérées avec succès
- **500 Internal Server Error** : Erreur serveur

#### Notes d'implémentation

- **Cache recommandé :** 15 minutes (données d'entraînement)
- **Source :** Tables Garmin en base de données
- **Calculs côté serveur :**
  - `averagePerSession = totalDistance / sessionCount`
  - `goalStatus` : comparaison avec objectif hebdo
  - `ratio = acuteLoad / chronicLoad`
  - `positionPercentage = (ratio / 2) * 100`
  - `trend` pour VO2 Max (> 1 = up, < -1 = down, sinon stable)
  - `improvementSeconds` : conversion temps → secondes pour calcul

---

## 📦 Schéma de chargement frontend

### Stratégie de chargement recommandée

```typescript
// app/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [healthData, setHealthData] = useState(null);
  const [musicData, setMusicData] = useState(null);
  const [runningData, setRunningData] = useState(null);

  const [healthLoading, setHealthLoading] = useState(true);
  const [musicLoading, setMusicLoading] = useState(true);
  const [runningLoading, setRunningLoading] = useState(true);

  const [healthError, setHealthError] = useState(null);
  const [musicError, setMusicError] = useState(null);
  const [runningError, setRunningError] = useState(null);

  useEffect(() => {
    // Chargement parallèle des 3 périmètres
    Promise.all([
      fetch('/api/dashboard/health')
        .then(res => res.json())
        .then(data => {
          setHealthData(data);
          setHealthLoading(false);
        })
        .catch(err => {
          setHealthError(err.message);
          setHealthLoading(false);
        }),

      fetch('/api/dashboard/music?period=last_7_days')
        .then(res => res.json())
        .then(data => {
          setMusicData(data);
          setMusicLoading(false);
        })
        .catch(err => {
          setMusicError(err.message);
          setMusicLoading(false);
        }),

      fetch('/api/dashboard/running')
        .then(res => res.json())
        .then(data => {
          setRunningData(data);
          setRunningLoading(false);
        })
        .catch(err => {
          setRunningError(err.message);
          setRunningLoading(false);
        })
    ]);
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Affichage conditionnel par section */}
      {healthLoading ? (
        <HealthSkeleton />
      ) : healthError ? (
        <HealthError error={healthError} />
      ) : (
        <HealthSection data={healthData} />
      )}

      {/* Idem pour Music et Running */}
    </div>
  );
}
```

---

## ✅ Checklist d'implémentation

### Backend (API Routes)

- [ ] Créer `/api/dashboard/health/route.ts`
- [ ] Créer `/api/dashboard/music/route.ts`
- [ ] Créer `/api/dashboard/running/route.ts`
- [ ] Implémenter les requêtes SQL vers Garmin/Spotify tables
- [ ] Implémenter les calculs dérivés (percentages, trends, etc.)
- [ ] Ajouter gestion d'erreurs avec try/catch
- [ ] Ajouter validation des paramètres (zod recommandé)
- [ ] Configurer le cache (Next.js cache ou Redis)
- [ ] Tester chaque endpoint avec données réelles

### Frontend (Dashboard)

- [ ] Créer les types TypeScript à partir de ce document
- [ ] Implémenter le chargement parallèle des 3 endpoints
- [ ] Créer les composants Skeleton pour chaque section
- [ ] Créer les composants Error pour chaque section
- [ ] Mapper les données API vers les cartes existantes
- [ ] Tester l'affichage avec données réelles
- [ ] Gérer les cas edge (données manquantes, nulls, etc.)
- [ ] Optimiser le re-render (useMemo/useCallback si nécessaire)

---

## 🔍 Formats de données spécifiques

### Dates
- **Format :** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- **Timezone :** UTC côté API, conversion locale côté frontend

### Durées
- **Format textuel :** `"Xh Ym"` (ex: `"3h 15m"`, `"12h 34m"`)
- **Format numérique :** minutes (integer)

### Temps de course
- **Format court :** `"MM:SS"` (ex: `"20:25"` pour 5K/10K)
- **Format long :** `"H:MM:SS"` (ex: `"1:32:45"` pour semi/marathon)

### Décimales
- **Poids :** 1 décimale (ex: `72.5`)
- **Distance :** 1 décimale (ex: `18.5`)
- **VO2 Max :** 0 décimale (ex: `54`)
- **Ratio :** 2 décimales (ex: `1.15`)

### Pourcentages
- **Affichage :** 1 décimale avec `%` (ex: `10.3%`)
- **Stockage :** nombre décimal (ex: `10.3`, pas `0.103`)

---

## 🚀 Optimisations recommandées

### Performances

1. **Cache stratifié :**
   - **Temps réel** (Body Battery, Stress) : 5 min
   - **Quotidien** (Sommeil, HRV) : 1 heure
   - **Hebdomadaire** (Musique, Volume) : 2 heures
   - **Mensuel** (VO2 Max, Prédictions) : 24 heures

2. **Compression :**
   - Activer gzip/brotli pour les réponses API
   - Les payloads sont volumineux (surtout running)

3. **Lazy loading :**
   - Charger les graphiques SVG uniquement quand visibles
   - Utiliser `Intersection Observer` pour les cartes hors viewport

### Sécurité

1. **Rate limiting :**
   - Max 60 requêtes/minute par IP
   - Max 10 requêtes/seconde global

2. **Validation :**
   - Valider le paramètre `period` pour `/api/dashboard/music`
   - Rejeter les requêtes avec headers suspects

3. **Headers CORS :**
   - Restreindre aux domaines autorisés en production

---

## 📞 Contact & Support

Pour toute question sur ces spécifications, contacter l'équipe frontend ou backend selon le périmètre concerné.

**Version du document :** 1.0
**Date de dernière mise à jour :** 2025-11-16
**Auteur :** Claude Code Assistant
