# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 web application (App Router) for personal health, fitness, and music analytics using Garmin and Spotify data stored in BigQuery. Features real-time dashboards with shadcn/ui components and TanStack Query for state management.

## Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run Next.js linter
```

### Adding shadcn/ui Components
```bash
npx shadcn@latest add <component-name>
```

## Architecture

### Data Flow
1. **Frontend** → Next.js API Routes (`app/api/*/route.ts`)
2. **API Routes** → External FastAPI Backend (`NEXT_PUBLIC_API_URL`)
3. **Backend** → BigQuery (via `@google-cloud/bigquery`)

### Three-Tier API Architecture

**API Route Layer** (Next.js):
- Acts as BFF (Backend for Frontend)
- Proxies requests to FastAPI backend
- Implements caching with ISR (Incremental Static Regeneration)
- Located in `app/api/` with Route Handlers

**Backend API Layer** (FastAPI):
- Defined by `NEXT_PUBLIC_API_URL` environment variable
- Handles business logic and data aggregation
- See `BACKEND_OPTIMIZATION_PLAN.md` for caching strategy

**Database Layer** (BigQuery):
- Three main dashboard views:
  - `pct_homepage__health_dashboard` - Health & wellness data
  - `pct_homepage__music_dashboard` - Spotify listening data
  - `pct_homepage__running_dashboard` - Running activities
- Direct access via `lib/bigquery.ts` singleton instance

### Cache Strategy

**API Route Cache Presets** (`lib/api/response.ts`):
- `homepage`: 15min fresh, 30min stale
- `activitiesList`: 10min fresh, 20min stale
- `activityDetail`: 1hr fresh, 2hr stale
- `musicClassement`: 1hr fresh, 2hr stale
- `recentlyPlayed`: 5min fresh, 10min stale

**TanStack Query Client** (`providers/query-provider.tsx`):
- `staleTime`: 5 minutes
- `gcTime`: 30 minutes
- Automatic retry with exponential backoff
- React Query Devtools enabled in development

### Key Directories

**`app/`** - Next.js App Router
- `api/*/route.ts` - API Route Handlers (GET endpoints)
- `page.tsx` - Main dashboard
- `activites/` - Activities list and detail pages
- `musique/` - Music classement and recently-played pages

**`components/`** - React Components
- `ui/` - shadcn/ui base components
- `activity/` - Activity-specific cards and charts
- `music/` - Music-specific components (pagination, filters)
- Root-level components for dashboard cards

**`lib/`** - Utilities
- `bigquery.ts` - Singleton BigQuery client instance
- `api/` - API utilities (fetcher, response helpers, query keys)
- `adapters/` - Data transformation layer
- `utils.ts` - Tailwind `cn()` utility

**`hooks/`** - Custom React Hooks
- `queries/` - TanStack Query hooks for data fetching
  - `use-homepage.ts` - Dashboard data
  - `use-activities.ts` - Activities list and detail
  - `use-music-classement.ts` - Top tracks/artists/albums
  - `use-recently-played.ts` - Recent listening history

**`types/`** - TypeScript Type Definitions
- `dashboard.ts` - Dashboard API contracts (Health, Music, Running)
- `activity.ts` / `activity-detail.ts` - Activity types
- `music.ts` - Music/Spotify types

**`providers/`** - React Context Providers
- `query-provider.tsx` - TanStack Query configuration

## Data Contracts

Dashboard API specifications are fully documented in `DASHBOARD_API_SPECS.md`:
- Health endpoint: `/api/dashboard/health`
- Music endpoint: `/api/dashboard/music?period=<period>`
- Running endpoint: `/api/dashboard/running`

All TypeScript types match these contracts in `types/dashboard.ts`.

## Environment Variables

Required in `.env.local`:
```bash
GCS_KEY='{"type":"service_account",...}'  # Google Cloud credentials JSON
NEXT_PUBLIC_API_URL=https://your-api.run.app  # FastAPI backend URL
```

See `.env.example` for template.

## BigQuery Integration

The `bigquery` singleton in `lib/bigquery.ts`:
- Initialized once with GCS credentials from env
- Project ID: `polar-scene-465223-f7`
- Used by API routes for direct queries (if not proxying to FastAPI)

## Component Patterns

### API Route Pattern
```typescript
// app/api/example/route.ts
import { cachedResponse, errorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/example`, {
      next: { revalidate: 900 }, // ISR revalidation
    });
    if (!response.ok) throw new Error('API call failed');
    const data = await response.json();
    return cachedResponse(data, 'homepage'); // Use preset from response.ts
  } catch (error) {
    return errorResponse('Failed to fetch data');
  }
}
```

### Query Hook Pattern
```typescript
// hooks/queries/use-example.ts
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/fetcher";
import { queryKeys } from "@/lib/api/query-keys";

export function useExample() {
  return useQuery({
    queryKey: queryKeys.example,
    queryFn: () => fetcher<ExampleData>("/api/example"),
  });
}
```

### Component Data Fetching Pattern
```typescript
"use client";
import { useExample } from "@/hooks/queries";

export default function Page() {
  const { data, isLoading, error } = useExample();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard />;
  return <DataDisplay data={data} />;
}
```

## Styling

- **Framework**: Tailwind CSS v3 with custom config
- **Theme**: CSS variables in `app/globals.css` for dark/light mode support
- **Components**: shadcn/ui with CVA (class-variance-authority)
- **Icons**: lucide-react
- **Charts**: recharts for data visualization
- **Maps**: react-leaflet for activity maps

## Path Aliases

TypeScript path mapping configured in `tsconfig.json`:
```typescript
"@/*" → "./*"  // Root-relative imports
```

Example: `import { Button } from "@/components/ui/button"`

## Key Technical Decisions

1. **Client Components**: Most pages use `"use client"` for TanStack Query integration
2. **No Server Actions**: All data fetching via API routes + TanStack Query
3. **ISR Caching**: Combine Next.js ISR with HTTP cache headers for optimal performance
4. **Type Safety**: Strict TypeScript with comprehensive type definitions
5. **Responsive Design**: Mobile-first with Tailwind breakpoints
6. **Data Freshness**: Tiered caching strategy based on data volatility

## Performance Optimization

Backend optimization plan documented in `BACKEND_OPTIMIZATION_PLAN.md`:
- Redis caching on FastAPI endpoints
- HTTP Cache-Control headers
- Database indexing strategy
- Connection pooling
- Pagination limits

## Development Notes

- Dashboard uses consolidated `/api/homepage` endpoint for efficiency (3 API calls instead of 24)
- Music data supports time-range filtering: `yesterday`, `last_7_days`, `last_30_days`, `last_365_days`, `all_time`
- Activity detail pages use dynamic routes: `/activites/[id]`
- BigQuery views pre-aggregate complex calculations for performance
- All dates are ISO 8601 format, conversion to local timezone happens client-side
