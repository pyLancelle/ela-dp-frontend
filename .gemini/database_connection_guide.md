# Guide de Connexion Base de Données (BigQuery)

Ce document décrit la procédure standard pour gérer les connexions à la base de données BigQuery dans ce projet.

## 1. Principe : Singleton Pattern
Pour des raisons de performance et de maintenance, nous utilisons une **instance unique** (Singleton) du client BigQuery pour toute l'application.

**Pourquoi ?**
- Évite de parser les credentials JSON à chaque requête.
- Centralise la configuration (ID projet, authentification).
- Facilite le mock pour les tests futurs.

## 2. Emplacement
Le client est défini dans : `lib/bigquery.ts`

```typescript
import { BigQuery } from '@google-cloud/bigquery';

// Configuration centralisée
const credentials = process.env.GCS_KEY
  ? JSON.parse(process.env.GCS_KEY)
  : undefined;

export const bigquery = new BigQuery({
  projectId: 'polar-scene-465223-f7',
  credentials,
});
```

## 3. Comment utiliser la connexion

Dans vos API Routes (`app/api/...`), n'instanciez **JAMAIS** `new BigQuery()` vous-même. Importez toujours l'instance partagée.

### ❌ À ne PAS faire (Anti-pattern)
```typescript
// app/api/my-route/route.ts
import { BigQuery } from '@google-cloud/bigquery';

export async function GET() {
  // Mauvais : Création d'une nouvelle connexion à chaque appel
  const bq = new BigQuery({ ... });
  const [rows] = await bq.query(...);
}
```

### ✅ À faire (Bonne pratique)
```typescript
// app/api/my-route/route.ts
import { bigquery } from '@/lib/bigquery'; // Import du singleton

export async function GET() {
  // Bon : Réutilisation de l'instance optimisée
  const [rows] = await bigquery.query(...);
  return NextResponse.json(rows);
}
```

## 4. Ajouter une nouvelle source de données
Si vous devez ajouter une autre base de données (ex: Postgres, Redis) :
1. Créez un nouveau fichier dans `lib/` (ex: `lib/redis.ts`).
2. Instanciez le client une seule fois.
3. Exportez l'instance.
4. Importez-la dans vos routes.
