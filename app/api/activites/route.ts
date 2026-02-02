import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RecentActivity {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  distance_km: number;
  duration_minutes: number;
  averageSpeed: number | null;
  typeKey: string | null;
}

export interface Activity {
  id: string;
  title: string;
  distance: number;
  duration: number;
  date: string;
  type: string;
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

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/activities/recent`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const recentActivities: RecentActivity[] = await response.json();

    const activities: Activity[] = recentActivities.map((activity) => ({
      id: activity.activityId.toString(),
      title: activity.activityName || 'Activité',
      distance: activity.distance_km || 0,
      duration: activity.duration_minutes || 0,
      date: formatDate(activity.startTimeGMT),
      type: activity.typeKey || 'running',
    }));

    return cachedResponse(activities, 'activitiesList');
  } catch (error) {
    console.error('Error fetching activities:', error);
    return errorResponse('Failed to fetch activities');
  }
}
