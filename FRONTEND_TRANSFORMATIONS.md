# Transformations Frontend à Déplacer vers le Backend

Ce document liste toutes les transformations de données actuellement effectuées dans le frontend (`hooks/queries/use-homepage.ts`) qui devraient être déplacées vers les vues BigQuery du backend.

## 1. Music Data Transformations

### Données brutes reçues
```typescript
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
```

### Transformations effectuées (lignes 131-193)

#### 1.1 Calcul de la moyenne d'écoute par jour
```typescript
const totalMs = musicTimeDailyRows.reduce((sum, row) => sum + (row.total_duration_ms || 0), 0);
const averageMs = totalMs / musicTimeDailyRows.length;
const avgHours = Math.floor(averageMs / (1000 * 60 * 60));
const avgMinutes = Math.floor((averageMs % (1000 * 60 * 60)) / (1000 * 60));
const averagePerDay = `${avgHours}h ${avgMinutes}m`;
```
**→ À faire dans BigQuery** : Retourner directement `average_per_day` formaté

#### 1.2 Calcul du max et des pourcentages de hauteur
```typescript
const maxDuration = Math.max(...musicTimeDailyRows.map((row) => row.total_duration_ms || 0));
const heightPercentage = maxDuration > 0 ? (durationMs / maxDuration) * 100 : 0;
```
**→ À faire dans BigQuery** : Calculer `height_percentage` pour chaque jour

#### 1.3 Formatage des durées par jour
```typescript
const durationMs = row.total_duration_ms || 0;
const hours = Math.floor(durationMs / (1000 * 60 * 60));
const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
const formatted = hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`;
```
**→ À faire dans BigQuery** : Retourner `formatted_duration` pour chaque jour

#### 1.4 Mapping des jours de la semaine
```typescript
const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const dateObj = new Date(row.date);
const day = dayNames[dateObj.getDay()];
```
**→ À faire dans BigQuery** : Retourner `day_abbr_french` directement

#### 1.5 Ordre des données (reverse)
```typescript
const sortedRows = [...musicTimeDailyRows].reverse();
```
**→ À faire dans BigQuery** : Trier par date DESC dans la vue

#### 1.6 Normalisation des propriétés artistes
```typescript
topArtists: data.top_artists.map((artist) => ({
  rank: artist.rank,
  name: artist.artistname || "Artiste inconnu",  // fallback
  trackCount: artist.play_count || 0,
  totalDuration: artist.total_duration || "0h 0m",
  playCount: artist.play_count || 0,
  imageUrl: artist.albumimageurl || null,
  externalUrl: artist.artistexternalurl || null,
}))
```
**→ À faire dans BigQuery** :
- Renommer `artistname` → `name`
- Gérer le fallback "Artiste inconnu" avec `COALESCE`
- Renommer `trackCount` et `playCount`
- Renommer `albumimageurl` → `image_url`, `artistexternalurl` → `external_url`

#### 1.7 Normalisation des propriétés tracks
```typescript
topTracks: data.top_tracks.map((track) => ({
  rank: track.rank,
  name: track.trackname || "Titre inconnu",
  artistName: track.all_artist_names || "Artiste inconnu",
  totalDuration: track.total_duration || "0m 0s",
  playCount: track.play_count || 0,
  imageUrl: track.albumimageurl || null,
  externalUrl: track.trackExternalUrl || null,
}))
```
**→ À faire dans BigQuery** :
- Renommer `trackname` → `name`
- Renommer `all_artist_names` → `artist_name`
- Gérer les fallbacks avec `COALESCE`
- Normaliser les noms de colonnes (snake_case)

---

## 2. Sleep Stages Transformations

### Données brutes reçues
```typescript
sleep_stages: {
  level_name: string;
  start_time: string;
  end_time: string;
}[];
```

### Transformations effectuées (lignes 196-208)

#### 2.1 Mapping des noms de stages
```typescript
let stage: SleepStage = row.level_name as SleepStage;
if (row.level_name === "light") stage = "core";
else if (row.level_name === "awake_restless") stage = "awake";
```
**→ À faire dans BigQuery** :
```sql
CASE
  WHEN level_name = 'light' THEN 'core'
  WHEN level_name = 'awake_restless' THEN 'awake'
  ELSE level_name
END as stage
```

#### 2.2 Renommage des propriétés
```typescript
{
  startTime: row.start_time,  // camelCase
  endTime: row.end_time,
  stage,
}
```
**→ À faire dans BigQuery** : Renommer directement en `start_time` et `end_time` (garder snake_case)

---

## 3. Sleep Body Battery Transformations

### Données brutes reçues
```typescript
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
```

### Transformations effectuées (lignes 211-289)

#### 3.1 Calcul de la moyenne des scores de sommeil
```typescript
const validSleepScores = sleepRows.filter((row) => row.sleep_score !== null);
const averageSleepScore = validSleepScores.length > 0
  ? Math.round(validSleepScores.reduce((sum, row) => sum + row.sleep_score, 0) / validSleepScores.length)
  : 0;
```
**→ À faire dans BigQuery** :
```sql
ROUND(AVG(sleep_score)) as average_sleep_score
```

#### 3.2 Calcul de la moyenne du gain de batterie
```typescript
const validDeltas = sleepRows.filter((row) => row.battery_gain !== null);
const averageDelta = validDeltas.length > 0
  ? Math.round(validDeltas.reduce((sum, row) => sum + row.battery_gain, 0) / validSleepScores.length)  // Bug: utilise validSleepScores.length au lieu de validDeltas.length
  : 0;
```
**→ À faire dans BigQuery** :
```sql
ROUND(AVG(battery_gain)) as average_battery_gain
```

#### 3.3 Calcul de la moyenne HRV
```typescript
const validHrv = sleepRows.filter((row) => row.avg_hrv !== null);
const averageHrv = validHrv.length > 0
  ? Math.round(validHrv.reduce((sum, row) => sum + row.avg_hrv, 0) / validHrv.length)
  : 0;
```
**→ À faire dans BigQuery** :
```sql
ROUND(AVG(avg_hrv)) as average_hrv
```

#### 3.4 Calcul de la moyenne du resting HR
```typescript
const validRestingHr = sleepRows.filter((row) => row.resting_hr !== null);
const averageRestingHr = validRestingHr.length > 0
  ? Math.round(validRestingHr.reduce((sum, row) => sum + row.resting_hr, 0) / validRestingHr.length)
  : 0;
```
**→ À faire dans BigQuery** :
```sql
ROUND(AVG(resting_hr)) as average_resting_hr
```

#### 3.5 Structure des données transformées
Le frontend construit une structure complexe avec `sleepScores`, `bodyBattery`, `hrv`, `restingHr` contenant chacun un `average` et un tableau `daily`.

**→ À faire dans BigQuery** : Créer deux types de résultats :
- Une ligne avec les moyennes
- Un array avec les données quotidiennes (ou table séparée)

---

## 4. Running Weekly Transformations

### Données brutes reçues
```typescript
running_weekly: {
  date: string;
  total_distance_km: number;
  aerobic_score: number;
  anaerobic_score: number;
}[];
```

### Transformations effectuées (lignes 292-351)

#### 4.1 Calculs d'agrégations
```typescript
const totalDistance = weeklyRows.reduce((sum, row) => sum + (row.total_distance_km || 0), 0);
const sessionCount = weeklyRows.filter((row) => row.total_distance_km > 0).length;
const averagePerSession = sessionCount > 0 ? totalDistance / sessionCount : 0;
```
**→ À faire dans BigQuery** :
```sql
SUM(total_distance_km) as total_distance,
COUNT(CASE WHEN total_distance_km > 0 THEN 1 END) as session_count,
SAFE_DIVIDE(SUM(total_distance_km), COUNT(CASE WHEN total_distance_km > 0 THEN 1 END)) as average_per_session
```

#### 4.2 Calcul des max pour les pourcentages
```typescript
const maxAerobic = Math.max(...weeklyRows.map((row) => row.aerobic_score || 0), 5);
const maxAnaerobic = Math.max(...weeklyRows.map((row) => row.anaerobic_score || 0), 5);

const aerobicHeightPercentage = maxAerobic > 0 ? (aerobicScore / maxAerobic) * 100 : 0;
const anaerobicHeightPercentage = maxAnaerobic > 0 ? (anaerobicScore / maxAnaerobic) * 100 : 0;
```
**→ À faire dans BigQuery** :
```sql
-- Pour chaque ligne
SAFE_DIVIDE(aerobic_score * 100, GREATEST(MAX(aerobic_score) OVER(), 5)) as aerobic_height_percentage,
SAFE_DIVIDE(anaerobic_score * 100, GREATEST(MAX(anaerobic_score) OVER(), 5)) as anaerobic_height_percentage
```

#### 4.3 Génération des 10 derniers jours
```typescript
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
  // ... calculs de pourcentages

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
```
**→ À faire dans BigQuery** : Générer les 10 derniers jours avec `GENERATE_DATE_ARRAY` et `LEFT JOIN`
```sql
WITH last_10_days AS (
  SELECT date
  FROM UNNEST(GENERATE_DATE_ARRAY(CURRENT_DATE() - 9, CURRENT_DATE())) as date
)
SELECT
  l.date,
  FORMAT_DATE('%a', l.date) as day,  -- Abbréviation en anglais, à adapter
  COALESCE(r.total_distance_km, 0) as distance,
  COALESCE(r.aerobic_score, 0) as aerobic_score,
  COALESCE(r.anaerobic_score, 0) as anaerobic_score,
  -- calculs de pourcentages
FROM last_10_days l
LEFT JOIN running_data r ON l.date = r.date
```

#### 4.4 Arrondi des distances
```typescript
totalDistance: Math.round(totalDistance * 10) / 10,
averagePerSession: Math.round(averagePerSession * 10) / 10,
```
**→ À faire dans BigQuery** :
```sql
ROUND(total_distance, 1) as total_distance,
ROUND(average_per_session, 1) as average_per_session
```

---

## 5. Weekly Volume Transformations

### Données brutes reçues
```typescript
running_weekly_volume: {
  week_start: string;
  total_distance_km: number;
}[];
```

### Transformations effectuées (lignes 354-392)

#### 5.1 Calculs d'agrégations
```typescript
const totalVolume = volumeRows.reduce((sum, row) => sum + (row.total_distance_km || 0), 0);
const average = totalVolume / volumeRows.length;
const max = Math.max(...volumeRows.map((row) => row.total_distance_km || 0));
```
**→ À faire dans BigQuery** :
```sql
AVG(total_distance_km) as average,
MAX(total_distance_km) as max
```

#### 5.2 Identification de la semaine courante
```typescript
const mostRecentWeek = volumeRows[0]?.week_start;
const isCurrent = row.week_start === mostRecentWeek;
```
**→ À faire dans BigQuery** :
```sql
week_start = (SELECT MAX(week_start) FROM table) as is_current
```

#### 5.3 Génération des labels de semaine
```typescript
const weeksFromNow = sortedRows.length - 1 - index;
const weekLabel = isCurrent ? "S0" : `S-${weeksFromNow}`;
```
**→ À faire dans BigQuery** :
```sql
CASE
  WHEN is_current THEN 'S0'
  ELSE CONCAT('S-', ROW_NUMBER() OVER (ORDER BY week_start DESC) - 1)
END as week_label
```

#### 5.4 Calcul du numéro de semaine
```typescript
// Fonction complexe getWeekNumber avec logique UTC
const weekNumber = getWeekNumber(weekStartDate);
const year = weekStartDate.getFullYear();
```
**→ À faire dans BigQuery** :
```sql
EXTRACT(ISOWEEK FROM week_start) as week_number,
EXTRACT(ISOYEAR FROM week_start) as year
```

#### 5.5 Tri inversé
```typescript
const sortedRows = [...volumeRows].reverse();
```
**→ À faire dans BigQuery** : `ORDER BY week_start DESC`

#### 5.6 Arrondi des volumes
```typescript
volume: Math.round(row.total_distance_km * 10) / 10,
average: Math.round(average * 10) / 10,
max: Math.round(max * 10) / 10,
```
**→ À faire dans BigQuery** :
```sql
ROUND(total_distance_km, 1) as volume,
ROUND(AVG(...), 1) as average,
ROUND(MAX(...), 1) as max
```

---

## 6. Race Predictions Transformations

### Données brutes reçues
```typescript
race_predictions: {
  distance: string;
  current_time: number;  // en secondes
  diff_seconds: number;
}[];
```

### Transformations effectuées (lignes 395-408)

#### 6.1 Formatage du temps (format HH:MM:SS ou MM:SS)
```typescript
function formatTime(seconds: number | string): string {
  const totalSeconds = typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
  if (isNaN(totalSeconds)) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}
```
**→ À faire dans BigQuery** :
```sql
CASE
  WHEN current_time >= 3600 THEN
    FORMAT('%d:%02d:%02d',
      CAST(FLOOR(current_time / 3600) AS INT64),
      CAST(FLOOR(MOD(current_time, 3600) / 60) AS INT64),
      CAST(FLOOR(MOD(current_time, 60)) AS INT64)
    )
  ELSE
    FORMAT('%d:%02d',
      CAST(FLOOR(current_time / 60) AS INT64),
      CAST(FLOOR(MOD(current_time, 60)) AS INT64)
    )
END as time
```

#### 6.2 Formatage de la différence (avec signe)
```typescript
function formatDifference(diffSeconds: number | string): string {
  const diff = typeof diffSeconds === "string" ? parseInt(diffSeconds, 10) : diffSeconds;
  if (isNaN(diff)) return "0:00";

  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / 60);
  const secs = Math.floor(absDiff % 60);
  const sign = diff >= 0 ? "+" : "-";
  return `${sign}${minutes}:${secs.toString().padStart(2, "0")}`;
}
```
**→ À faire dans BigQuery** :
```sql
CONCAT(
  IF(diff_seconds >= 0, '+', '-'),
  FORMAT('%d:%02d',
    CAST(FLOOR(ABS(diff_seconds) / 60) AS INT64),
    CAST(FLOOR(MOD(ABS(diff_seconds), 60)) AS INT64)
  )
) as difference
```

#### 6.3 Détermination de l'amélioration
```typescript
isImprovement: row.diff_seconds < 0,
```
**→ À faire dans BigQuery** :
```sql
diff_seconds < 0 as is_improvement
```

---

## 7. VO2max Trend Transformations

### Données brutes reçues
```typescript
vo2max_trend?: {
  current_date: string;
  current_vo2max: number;
  weekly_vo2max_array: number[];
  vo2max_delta_6_months: number;
};
```

### Transformations effectuées (lignes 411-418)

#### 7.1 Simple remapping (camelCase)
```typescript
vo2maxTrend = {
  currentDate: data.vo2max_trend.current_date,
  currentVo2max: data.vo2max_trend.current_vo2max,
  weeklyVo2maxArray: data.vo2max_trend.weekly_vo2max_array,
  vo2maxDelta6Months: data.vo2max_trend.vo2max_delta_6_months,
};
```
**→ À faire dans BigQuery** : Aucune transformation nécessaire, juste garder snake_case côté frontend

---

## Recommandations

### Structure de réponse cible
Le backend devrait retourner des données **déjà formatées et prêtes à l'affichage** :

1. **Pas de transformations complexes côté frontend** (reduce, map, filter avec logique métier)
2. **Toutes les moyennes/agrégations calculées en SQL**
3. **Tous les formatages (dates, durées, pourcentages) faits en SQL**
4. **Snake_case uniforme** (le frontend n'a pas à faire de remapping camelCase)
5. **Structure plate autant que possible** pour éviter les transformations imbriquées

### Avantages
- ✅ Performance : Les calculs se font en SQL (optimisé)
- ✅ Cohérence : Une seule source de vérité pour la logique métier
- ✅ Maintenabilité : Plus facile de déboguer des requêtes SQL
- ✅ Testabilité : Peut tester les vues BigQuery indépendamment
- ✅ Cache : Le backend peut cacher les résultats précalculés

### Structure JSON cible recommandée

```json
{
  "music": {
    "generated_at": "2024-01-15T10:00:00Z",
    "period": "last_7_days",
    "listening_time": {
      "average_per_day": "2h 15m",
      "days": [
        {
          "date": "2024-01-15",
          "day": "Lun",
          "duration_ms": 8100000,
          "formatted": "2h15m",
          "height_percentage": 85.5
        }
      ]
    },
    "top_artists": [...],
    "top_tracks": [...]
  },
  "sleep_body_battery": {
    "averages": {
      "sleep_score": 85,
      "battery_gain": 42,
      "hrv": 58,
      "resting_hr": 52
    },
    "daily": [...]
  },
  "running": {
    "totals": {
      "total_distance": 25.5,
      "session_count": 4,
      "average_per_session": 6.4
    },
    "daily": [...]  // 10 derniers jours avec fallback à 0
  },
  // ... etc
}
```
