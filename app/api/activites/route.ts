import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ActivityFromAPI {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  typeKey: string | null;
  distance_km: number;
  duration_minutes: number;
  averageHR: number | null;
  hrZone1_pct: number | null;
  hrZone2_pct: number | null;
  hrZone3_pct: number | null;
  hrZone4_pct: number | null;
  hrZone5_pct: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  polyline_simplified: any;
}

export interface Activity {
  id: string;
  title: string;
  distance: number;
  duration: number;
  date: string;
  rawDate: string;
  type: string;
  avgHr: number | null;
  hrZones: [number, number, number, number, number] | null;
  polyline: [number, number][] | null;
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    if (diffHours === 0) return 'Il y a moins d\'une heure';
    if (diffHours === 1) return 'Il y a 1 heure';
    return `Il y a ${diffHours} heures`;
  } else if (diffDays === 1) {
    return 'Hier';
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }
}

// Normalise whatever shape the backend sends into [lat, lng][] or null
// Handles: [[lat,lng]], [{lat,lng}], [{latitude,longitude}], JSON string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPolyline(raw: any): [number, number][] | null {
  if (!raw) return null;
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const first = arr[0];
    if (Array.isArray(first)) {
      // [[lat, lng], ...]
      return arr as [number, number][];
    }
    if (typeof first === 'object') {
      const lat = 'lat' in first ? 'lat' : 'latitude';
      const lng = 'lng' in first ? 'lng' : 'longitude';
      // [lng, lat] so the component treats index 0 as X (east) and index 1 as Y (north)
      return arr.map((p: Record<string, number>) => [p[lng], p[lat]]);
    }
  } catch {
    // malformed — fall through to null
  }
  return null;
}

function toHrZones(a: ActivityFromAPI): [number, number, number, number, number] | null {
  const z = [a.hrZone1_pct, a.hrZone2_pct, a.hrZone3_pct, a.hrZone4_pct, a.hrZone5_pct];
  if (z.every((v) => v === null)) return null;
  return z.map((v) => v ?? 0) as [number, number, number, number, number];
}

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/activities/list`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const raw: ActivityFromAPI[] = await response.json();

    const activities: Activity[] = raw.map((a) => ({
      id: a.activityId.toString(),
      title: a.activityName || 'Activité',
      distance: a.distance_km || 0,
      duration: a.duration_minutes || 0,
      date: formatDate(a.startTimeGMT),
      rawDate: a.startTimeGMT,
      type: a.typeKey || 'running',
      avgHr: a.averageHR,
      hrZones: toHrZones(a),
      polyline: toPolyline(a.polyline_simplified),
    }));

    return cachedResponse(activities, 'activitiesList');
  } catch (error) {
    console.error('Error fetching activities:', error);
    return errorResponse('Failed to fetch activities');
  }
}
