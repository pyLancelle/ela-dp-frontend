# CLAUDE.md

## Git Workflow

Pour toute tache impliquant des modifications de code, utiliser le skill `/task-git`.

Regles absolues :
- Ne JAMAIS push directement sur `main` ou `develop`.
- Merge uniquement par pull request.

---

## Architecture générale

Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v3, shadcn/ui.

**Stack :**
- `@tanstack/react-query` v5 — fetching côté client, cache, stale-time
- `motion` (framer-motion v12) — animations sidebar, blur-fade
- `recharts` — graphiques (HR, intervalles, barres)
- `react-leaflet` / `leaflet` — cartes GPS
- `lucide-react` — icônes

**Source de données unique :** Google Cloud Storage (bucket `ela-dp-export`).
Toutes les routes API Next.js sont de simples proxies vers des JSON statiques pré-exportés dans GCS. Il n'y a pas de base de données ni de backend actif.

---

## Structure des dossiers

```
app/                    Pages et routes API (App Router)
  api/                  Proxies GCS — pas de logique métier
  activites/            Pages sport
  music/artists/        Page focus artiste
  musique/classements/  Page classements musique
components/
  magicui/              Composants visuels Magic UI (BentoGrid, MagicCard, BlurFade…)
  activity/             Composants de la page détail activité
  music/                Composants music (heatmap, chart artiste…)
  ui/                   shadcn/ui primitives
hooks/queries/          Hooks React Query (un fichier par domaine)
lib/
  api/                  fetcher, query-keys, response helpers
  adapters/             Transformation BigQuery → types UI
  mock/                 Données mock pour dev
providers/              QueryProvider, RightPanelProvider
types/                  Interfaces TypeScript par domaine
```

---

## Pages

### `/` — Dashboard Home

**Source :** `GET /api/homepage` → `https://storage.googleapis.com/ela-dp-export/homepage.json`

**Hook :** `useHomepage()` dans `hooks/queries/use-homepage.ts`

**Transformations côté client (`transformHomepageData`) :**
- `music_time_daily` → barre par jour + moyenne formatée
- `top_artists` / `top_tracks` → renommage de champs snake_case vers camelCase
- `sleep_stages` : normalise `light` → `core`, `awake_restless` → `awake`
- `sleep_scores`, `body_battery`, `hrv`, `resting_hr` → objet `sleepBodyBattery`
- `running_weekly` → calcul distance totale, sessions, scores aérobie/anaérobie sur 10 jours glissants
- `running_weekly_volume` → semaines étiquetées `S0`, `S-1`…
- `race_predictions` → formatage temps (secondes → `h:mm:ss`) + signe différence
- `vo2max_trend`, `stress_daily`, `steps` → renommage minimal

**Layout :** BentoGrid 6 colonnes, cards disposées par `col-start`/`row-start` explicites.

**Cards (de gauche à droite, haut en bas) :**
- Sommeil stages (2×1) — timeline des phases de sommeil
- Score sommeil (1×1) — barres 7 jours + moyenne /100
- Body Battery (1×1) — delta gain par nuit
- Running Card (2×2) — distance / sessions / scores aérobie+anaérobie sur 10 jours
- Listening Time (2×1) — temps d'écoute Spotify 10 derniers jours
- Top Artists/Tracks (2×3) — top 5 artistes + top 5 titres
- HRV (1×1), FC Repos (1×1)
- Stress (1×1), Pas (1×1)
- VO2max trend (1×1)
- Race Predictions (1×2) — temps prédit sur distances classiques

---

### `/activites` — Liste des activités

**Source :** `GET /api/activites` → `https://storage.googleapis.com/ela-dp-export/garmin/activities_list.json`

**Hook :** `useActivitiesList()`

**Transformations côté API (`app/api/activites/route.ts`) :**
- Renommage champs Garmin (`activityId`, `startTimeGMT`, `typeKey`…) → interface `Activity`
- `formatDate()` : timestamp → "Il y a X heures / Hier / Il y a X jours / 12 janvier"
- `toPolyline()` : normalise `[[lat,lng]]`, `[{lat,lng}]`, `[{latitude,longitude}]` ou JSON string → `[number,number][]`
- `toHrZones()` : 5 champs `hrZone1_pct`…`hrZone5_pct` → tuple ou null

**UI :** Grid 6 colonnes, groupé par mois (séparateurs), pagination "charger plus" par tranches de 20.
Chaque carte `ActivityRichCard` affiche : type, titre, distance, durée, FC, mini-carte polyline, HR zones.

---

### `/activites/[id]` — Détail d'une activité

**Source :** `GET /api/activites/[id]` → `https://storage.googleapis.com/ela-dp-export/garmin/activity_{id}.json`

**Hook :** `useActivityDetail(id)`

**Transformations (`lib/adapters/activity-adapter.ts`) :**
- `activityToSummary()` : metres → km, m/s → km/h + pace min/km, timestamps → heure locale FR
- `activityToScores()` : `activityTrainingLoad` / 3 → stamina ; training effects conservés
- `activityToHeartRateZones()` : zones HR avec bornes estimées depuis `maxHR`
- `lapsToIntervals()` : `kilometer_laps` → intervalles avec type (`warmup` pour lap 0, `work` sinon), zone dominante déduite de `averageHR`
- `extractLocation()` : nom activité → ville (regex sur "Course", "Vélo", "Running"…)

**Layout bento 6 colonnes :**
- KPIs (1×2) : distance, durée, allure, FC moy/max, dénivelé, calories
- Intervalles recharts (2×1) : barres empilées pace/FC par km
- Carte GPS Leaflet (3×1) : polyline de la trace
- Zones cardiaques (2×1) : barres horizontales % par zone
- Évolution FC (3×1) : courbe temporelle avec zones colorées
- Liste intervalles (3×2) : tableau km par km avec titres lus pendant l'effort

**Background :** 3 orbes animés (orange, bleu, vert) en `fixed -z-10`, animations CSS `orb1/2/3`.

---

### `/musique/classements` — Classements musicaux

**Source :** `GET /api/music/music-classement?period=...`
→ `https://storage.googleapis.com/ela-dp-export/music_classement_{period}.json`

**Périodes valides :** `yesterday`, `last_7_days`, `last_30_days`, `last_365_days`, `all_time`

**Hook :** `useMusicClassement(preset, limit)`

**Normalisation côté API :** si `artistid` (string) présent sans `artist_ids` (array), crée `artist_ids = [artistid]`.

**UI :** 3 tableaux côte à côte (Top Titres / Top Artistes / Top Albums).
Filtre par période via `DateRangeFilter` (presets uniquement, pas de range custom).
`ArtistLinks` : liens cliquables vers la page focus artiste via `?id={artist_id}`.
`NumberTicker` : animation compteur sur les play counts.

---

### `/music/artists` — Focus artiste

**Sources :**
- Index : `GET /api/music/artist-focus` → `artist_focus/index.json` (liste de tous les artistes avec stats résumées)
- Détail : `GET /api/music/artist-focus/[id]` → `artist_focus/{id}.json`

**Hooks :** `useArtistFocusList()`, `useArtistFocus(id)`

**Transformations côté page :**
- `calendarToHeatmap()` : `calendar[]` → `{date, minutes}[]` pour le composant `ArtistHeatmap`
- `calendarToWeeklyChart()` : agrégation par semaine depuis le 2025-07-01, génère toutes les semaines jusqu'à aujourd'hui (y compris celles sans données = 0)
- `computeWeeklyStreak()` : nombre de semaines consécutives avec au moins 1 écoute, en remontant depuis la semaine courante
- `formatSelectorHours()` : durée string `"12h 30m"` → `"13h"` pour le sélecteur

**Layout bento 6 colonnes :**
- Hero card (2×1) : photo artiste + sélecteur combobox + genres + date première écoute, gradient de fond calculé depuis `useImageColor()`
- KPIs (1×1 chacun) : Écoutes, Durée, Titres uniques
- Streak (1×1) : flamme + compteur semaines consécutives
- Évolution (6×1) : histogramme barres empilées plays + minutes par semaine
- Heatmap calendrier (2×1) : carrés jour par jour (GitHub-style)
- Rythme d'écoute (2×1) : grille 7 jours × 24h, intensité = minutes d'écoute, couleur accentuée depuis cover
- Top Titres (2×2) : liste avec barre de fond proportionnelle aux plays
- Top Albums (2×2) : même layout
- Discographie mosaic (6×1) : covers scrollables horizontalement (drag), badge `tracks_heard/total_tracks` coloré (vert ≥80%, ambre ≥40%, gris sinon)

**`useImageColor()`** : extrait la couleur dominante d'une image via canvas, utilisée pour teinter les éléments UI (fond hero, grille rythme, barres) à la couleur de la cover artiste.

---

## Philosophie graphique

### Liquid Glass
Classe utilitaire centrale `.liquid-glass-card` (définie dans `globals.css`) :
- Fond : `linear-gradient` blanc translucide (18% → 6% → 12%)
- Effet : `backdrop-filter: blur(20px) saturate(180%)`
- Bordure iridescente : `border: 1px solid rgba(255,255,255,0.28)`
- Reflets : `box-shadow` inset haut (reflet lumineux) + inset bas (ombre douce) + ombre portée

Appliqué à quasiment toutes les cards, le sidebar, les items de nav actifs. Fonctionne en light et dark mode.

### Magic UI
Composants de `components/magicui/` inspirés de [Magic UI](https://magicui.design) :
- **`MagicCard`** : wrapper qui déclenche un `BorderBeam` (rayon lumineux animé le long du bord) au hover. Paramètres `beamDuration` et `beamSize`.
- **`BentoGrid`** : grille CSS `auto-rows-[180px]` 6 colonnes avec gap, responsive (1 col mobile).
- **`BlurFade`** : fade-in + slide-up avec délai configurable (utilisé pour l'apparition en cascade des cards).
- **`BorderBeam`** : SVG animé qui trace un faisceau lumineux blanc → violet sur le contour.
- **`NumberTicker`** : compteur animé qui "roule" jusqu'à la valeur cible.
- **`DotPattern`** : fond SVG en grille de points, positionné en `fixed -z-10` dans le layout.
- **`AuroraText`**, **`AnimatedShinyText`** : effets texte décoratifs.

### Orbes animés
Sur la page détail activité : 3 `div` avec `radial-gradient` + `blur-3xl` + animations CSS `orb1/2/3` (translate + scale, `alternate infinite`). Créent un fond vivant organique.

### Accent color dynamique
Sur la page artiste : `useImageColor(imageUrl)` → extrait `{r, g, b}` depuis la cover → injecté en `rgba()` inline sur les fonds, bordures et barres des composants. Donne un thème cohérent avec l'identité visuelle de l'artiste.

### Thème dark/light
- Variables CSS shadcn/ui complètes (light + `.dark`)
- Script inline dans `<head>` pour appliquer la classe `dark` avant le premier paint (évite le flash)
- `ThemeToggle` dans le header

---

## Couche API et cache

Routes API dans `app/api/` : proxies purs vers GCS, `cache: 'no-store'` côté fetch serveur.

Cache côté client (React Query, `staleTime`) :
- Homepage : 15 min
- Liste activités : 10 min
- Détail activité : 1h (5 min si id = "last")
- Classements musique : 1h
- Artist focus : géré par react-query defaults

Helper `cachedResponse()` dans `lib/api/response.ts` : répond `no-store, no-cache` (le cache est entièrement côté client via React Query).

---

## Conventions importantes

- Les liens vers la page artiste utilisent `?id={artist_id}` (Spotify ID), jamais `?name=`.
- `artist_ids` est toujours un array (normalisé en route API si besoin depuis `artistid` string).
- Les polylines GPS sont toujours `[lat, lng][]` après normalisation.
- Toutes les durées longues sont en ms dans les données brutes, converties en minutes à l'affichage.
