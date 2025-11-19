# Analyse du Repository

## 1. Vue d'ensemble
Ce projet est un **Dashboard Personnel** agrégeant des données de trois domaines principaux :
- **Santé** (Garmin : Sommeil, HRV, Poids, Stress)
- **Musique** (Spotify : Top artistes, titres, temps d'écoute)
- **Course à pied** (Garmin : Stats hebdo, VO2 Max, Prédictions)

L'objectif est d'afficher ces données via une interface moderne (Bento Grid) construite avec **shadcn/ui**.

## 2. Stack Technique
- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Base de données** : Google BigQuery (Projet : `polar-scene-465223-f7`)
- **Déploiement** : Vercel (supposé)

## 3. Architecture Actuelle

### 3.1 Frontend (`app/page.tsx`)
- **État** : **Mocké**. Le composant principal `Home` contient toutes les données en dur (tableaux statiques, valeurs fixes).
- **UI** : Utilise une grille "Bento" responsive. Les composants graphiques (Jauges, BarCharts) sont implémentés directement dans la page avec des SVGs et divs.
- **Interactivité** : Limitée (états locaux pour `showArtists` et tooltips), mais pas de fetching de données réel.

### 3.2 Backend (`app/api/`)
- **État** : **Partiellement implémenté & Connecté**.
- **Connexion** : Les routes API se connectent réellement à BigQuery via `@google-cloud/bigquery`.
- **Authentification** : Utilise une clé de service stockée dans la variable d'environnement `GCS_KEY`.
- **Structure** :
    - `app/api/music/top-artists/route.ts` : Implémenté. Requête la table `pct_classement__top_artist_by_period`.
    - `app/api/music/top-tracks/` : (Dossier présent, implémentation à vérifier)
    - `app/api/music/top-albums/` : (Dossier présent, implémentation à vérifier)

### 3.3 Données (BigQuery)
- **Dataset** : `dp_product_dev`
- **Tables/Vues identifiées** :
    - `pct_classement__top_artist_by_period`
    - (Probablement d'autres vues correspondantes pour tracks/albums)

## 4. Écarts par rapport aux Spécifications (`DASHBOARD_API_SPECS.md`)

| Sujet | Spécifications (Cible) | Implémentation Actuelle |
|-------|------------------------|-------------------------|
| **Stratégie API** | **Vue par Périmètre** (3 endpoints globaux : `/health`, `/music`, `/running`) | **Vue par Ressource** (Endpoints granulaires : `/music/top-artists`, etc.) |
| **Client BigQuery** | Non spécifié, mais bonnes pratiques suggèrent un singleton dans `lib/` | Instancié directement dans chaque fichier de route (`route.ts`). |
| **Frontend** | Doit consommer l'API | Utilise des données mockées en dur. |

## 5. Points d'Attention & Dette Technique
1.  **Divergence API** : L'implémentation actuelle de l'API (`/api/music/top-artists`) ne suit pas la recommandation des specs (`/api/dashboard/music`). Il faudra décider si on refactorise pour suivre les specs (recommandé pour la perf) ou si on garde l'approche granulaire.
2.  **Duplication de code** : L'instanciation du client BigQuery et le parsing de `GCS_KEY` sont faits dans le handler de route. À déplacer dans `lib/bigquery.ts`.
3.  **Sécurité** : `GCS_KEY` est parsé depuis une string JSON. S'assurer que le `.env` est bien sécurisé.

## 6. Prochaines Étapes Recommandées
1.  **Unifier l'API** : Créer les endpoints agrégés (`/api/dashboard/music`, etc.) conformes aux specs pour réduire le nombre de requêtes HTTP.
2.  **Connecter le Frontend** : Remplacer les mocks de `app/page.tsx` par des appels `fetch` vers ces nouveaux endpoints.
3.  **Centraliser BigQuery** : Créer un utilitaire `lib/db.ts` ou `lib/bigquery.ts` pour gérer la connexion.
