import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

let credentials;
try {
  credentials = process.env.GCS_KEY ? JSON.parse(process.env.GCS_KEY) : undefined;
} catch (error) {
  console.error('Error parsing GCS_KEY:', error);
  console.error('GCS_KEY value:', process.env.GCS_KEY?.substring(0, 100));
}

const bigquery = new BigQuery({
  projectId: 'polar-scene-465223-f7',
  credentials,
});

// BigQuery view schema from pct_activites__last_run
// Note: We do basic transformations in SQL for consistency and performance
interface BigQueryActivity {
  activityId: number;
  activityName: string;
  startTimeGMT: string; // ISO timestamp string
  distance_km: number | null; // Already converted from meters to km in SQL
  duration_minutes: number | null; // Already converted from seconds to minutes in SQL
  averageSpeed: number | null; // in m/s
  typeKey: string | null; // Activity type from source
}

// Frontend Activity interface
export interface Activity {
  id: string;
  title: string;
  distance: number;
  duration: number; // in minutes
  date: string;
  type: string;
}

// Note: Duration conversion is now handled in SQL
// Keeping this function for backward compatibility and potential future use
function parseDuration(durationSeconds: number): number {
  if (durationSeconds == null) return 0;
  return Math.round(durationSeconds / 60);
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
    const query = `
      SELECT
        activityId,
        activityName,
        startTimeGMT,
        -- Convert meters to kilometers (better precision handling in SQL)
        ROUND(distance / 1000, 2) AS distance_km,
        -- Convert seconds to minutes (avoid client-side calculation)
        ROUND(duration / 60, 0) AS duration_minutes,
        averageSpeed,
        -- Include activity type for better categorization
        typeKey
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_activites__last_run\`
      ORDER BY startTimeGMT DESC
    `;

    const [rows] = await bigquery.query(query);

    // Map BigQuery data to frontend format
    // Note: Basic transformations (distance, duration) are now handled in SQL
    const activities: Activity[] = rows.map((row: BigQueryActivity) => {
      return {
        id: row.activityId.toString(), // Use the real activityId from BigQuery
        title: row.activityName || 'Activité',
        distance: row.distance_km || 0, // Already in kilometers from SQL
        duration: row.duration_minutes || 0, // Already in minutes from SQL
        date: formatDate(row.startTimeGMT),
        type: row.typeKey || 'running', // Use actual type if available, fallback to running
      };
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
