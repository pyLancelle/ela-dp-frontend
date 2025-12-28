# Plan d'Optimisation Backend (FastAPI)

Ce document décrit les optimisations à implémenter côté backend FastAPI pour améliorer les temps de réponse API.

---

## Priorité 1 : Caching Redis (Impact Élevé)

### 1.1 Installer les dépendances

```bash
pip install redis aioredis
```

### 1.2 Créer un décorateur de cache

**Nouveau fichier : `core/cache.py`**

```python
import redis
import hashlib
import json
from functools import wraps
from typing import Optional

# Configuration Redis
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)

def cache_response(ttl_seconds: int, key_prefix: Optional[str] = None):
    """
    Décorateur pour mettre en cache les réponses API.

    Args:
        ttl_seconds: Durée de vie du cache en secondes
        key_prefix: Préfixe optionnel pour la clé de cache
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Construire la clé de cache
            prefix = key_prefix or func.__name__
            key_data = json.dumps(kwargs, sort_keys=True, default=str)
            cache_key = f"{prefix}:{hashlib.md5(key_data.encode()).hexdigest()}"

            # Vérifier le cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # Exécuter la fonction et mettre en cache
            result = await func(*args, **kwargs)
            redis_client.setex(cache_key, ttl_seconds, json.dumps(result, default=str))
            return result
        return wrapper
    return decorator
```

### 1.3 Appliquer aux endpoints

| Endpoint | TTL | Exemple |
|----------|-----|---------|
| `/api/homepage` | 900s (15 min) | `@cache_response(900, "homepage")` |
| `/api/activities/recent` | 600s (10 min) | `@cache_response(600, "activities_recent")` |
| `/api/music/top-tracks` | 3600s (1h) | `@cache_response(3600, "top_tracks")` |
| `/api/music/top-artists` | 3600s (1h) | `@cache_response(3600, "top_artists")` |
| `/api/music/top-albums` | 3600s (1h) | `@cache_response(3600, "top_albums")` |
| `/api/music/recently-played` | 300s (5 min) | `@cache_response(300, "recently_played")` |

**Exemple d'application :**

```python
from core.cache import cache_response

@router.get("/api/music/top-tracks")
@cache_response(ttl_seconds=3600, key_prefix="top_tracks")
async def get_top_tracks(period: str = "all_time", limit: int = 20):
    # ... logique existante
    pass
```

---

## Priorité 2 : Headers HTTP Cache (Impact Moyen-Élevé)

### 2.1 Créer un middleware Cache Headers

**Nouveau fichier : `middleware/cache_headers.py`**

```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class CacheHeaderMiddleware(BaseHTTPMiddleware):
    """
    Middleware pour ajouter automatiquement les headers Cache-Control.
    """

    CACHE_CONFIG = {
        "/api/homepage": "public, max-age=900, stale-while-revalidate=1800",
        "/api/activities/recent": "public, max-age=600, stale-while-revalidate=1200",
        "/api/music/top-tracks": "public, max-age=3600, stale-while-revalidate=7200",
        "/api/music/top-artists": "public, max-age=3600, stale-while-revalidate=7200",
        "/api/music/top-albums": "public, max-age=3600, stale-while-revalidate=7200",
        "/api/music/recently-played": "public, max-age=300, stale-while-revalidate=600",
    }

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        path = request.url.path

        # Appliquer le header approprié
        for pattern, header in self.CACHE_CONFIG.items():
            if path.startswith(pattern):
                response.headers["Cache-Control"] = header
                response.headers["CDN-Cache-Control"] = header
                break

        return response
```

### 2.2 Intégrer dans l'application

**Dans `main.py` :**

```python
from middleware.cache_headers import CacheHeaderMiddleware

app = FastAPI()
app.add_middleware(CacheHeaderMiddleware)
```

---

## Priorité 3 : Optimisation Base de Données (Impact Moyen)

### 3.1 Index à créer

```sql
-- Pour les requêtes top tracks/artists/albums
CREATE INDEX IF NOT EXISTS idx_listening_history_played_at
ON listening_history(played_at DESC);

CREATE INDEX IF NOT EXISTS idx_listening_history_artist_id
ON listening_history(artist_id);

CREATE INDEX IF NOT EXISTS idx_listening_history_track_id
ON listening_history(track_id);

CREATE INDEX IF NOT EXISTS idx_listening_history_album_id
ON listening_history(album_id);

-- Index composites pour les filtres de période
CREATE INDEX IF NOT EXISTS idx_listening_history_date_artist
ON listening_history(played_at, artist_id);

CREATE INDEX IF NOT EXISTS idx_listening_history_date_track
ON listening_history(played_at, track_id);

-- Pour les activités
CREATE INDEX IF NOT EXISTS idx_activities_start_time
ON activities(start_time DESC);

CREATE INDEX IF NOT EXISTS idx_activities_type
ON activities(activity_type);
```

### 3.2 Vues matérialisées (optionnel, pour agrégations lourdes)

```sql
-- Vue matérialisée pour les top tracks hebdomadaires
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_top_tracks_weekly AS
SELECT
    track_id,
    track_name,
    artist_name,
    COUNT(*) as play_count,
    SUM(duration_ms) as total_duration_ms
FROM listening_history
WHERE played_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY track_id, track_name, artist_name
ORDER BY play_count DESC
LIMIT 100;

-- Refresh programmé (à exécuter via cron/scheduler)
-- REFRESH MATERIALIZED VIEW mv_top_tracks_weekly;
```

---

## Priorité 4 : Connection Pooling (Impact Moyen)

### 4.1 Configuration SQLAlchemy

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,           # Connexions permanentes
    max_overflow=20,        # Connexions supplémentaires autorisées
    pool_timeout=30,        # Timeout pour obtenir une connexion
    pool_recycle=1800,      # Recycler les connexions après 30 min
    pool_pre_ping=True,     # Vérifier la connexion avant utilisation
)
```

### 4.2 Configuration asyncpg (si async)

```python
import asyncpg

async def create_pool():
    return await asyncpg.create_pool(
        DATABASE_URL,
        min_size=5,
        max_size=20,
        command_timeout=60,
    )
```

---

## Priorité 5 : Limites de Pagination (Impact Faible)

### 5.1 Validation des paramètres

```python
from fastapi import Query

@router.get("/api/music/recently-played")
async def get_recently_played(
    page: int = Query(default=1, ge=1, description="Numéro de page"),
    page_size: int = Query(default=50, ge=1, le=100, description="Taille de page (max 100)"),
    artist: str = Query(default=None, max_length=200),
    date_from: str = Query(default=None, regex=r"^\d{4}-\d{2}-\d{2}$"),
    date_to: str = Query(default=None, regex=r"^\d{4}-\d{2}-\d{2}$"),
):
    # ... implémentation
    pass
```

---

## Résumé des TTL Recommandés

| Endpoint | TTL Cache Redis | TTL Cache HTTP | Commentaire |
|----------|-----------------|----------------|-------------|
| `/api/homepage` | 15 min | 15 min | Données agrégées, changent peu |
| `/api/activities/recent` | 10 min | 10 min | Liste récente des activités |
| `/api/music/top-tracks` | 1h | 1h | Classements stables |
| `/api/music/top-artists` | 1h | 1h | Classements stables |
| `/api/music/top-albums` | 1h | 1h | Classements stables |
| `/api/music/recently-played` | 5 min | 5 min | Données plus dynamiques |

---

## Ordre d'Implémentation Recommandé

1. **Redis Cache** - Impact immédiat et significatif
2. **HTTP Cache Headers** - Améliore le cache CDN/navigateur
3. **Index SQL** - Améliore les requêtes de base
4. **Connection Pooling** - Réduit la latence des connexions
5. **Vues matérialisées** - Optionnel, pour les agrégations très lourdes

---

## Gains Attendus

| Métrique | Avant | Après (estimé) | Amélioration |
|----------|-------|----------------|--------------|
| `/api/homepage` (cold) | 2-3s | 500ms-1s | **60-80%** |
| `/api/homepage` (cache) | 2-3s | <50ms | **95%+** |
| `/api/music/top-*` (cold) | 1-2s | 300-500ms | **70%** |
| `/api/music/top-*` (cache) | 1-2s | <50ms | **95%+** |
| `/api/music/recently-played` | 500ms-1s | 100-200ms | **75%** |

---

## Variables d'Environnement à Ajouter

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Database Pool
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20
DB_POOL_TIMEOUT=30
```

---

## Fichiers à Créer

```
core/
└── cache.py                    # Décorateur de cache Redis

middleware/
└── cache_headers.py            # Middleware Cache-Control headers

migrations/
└── add_indexes.sql             # Script de création d'index
```

## Fichiers à Modifier

```
main.py                         # Ajouter le middleware
config.py                       # Variables Redis et pool
requirements.txt                # Ajouter redis, aioredis

# Endpoints à décorer avec @cache_response:
routes/homepage.py
routes/activities.py
routes/music/top_tracks.py
routes/music/top_artists.py
routes/music/top_albums.py
routes/music/recently_played.py
```
