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

// BigQuery view schema
interface BigQueryActivity {
  activityname: string;
  starttimelocal: { value: string }; // BigQuery TIMESTAMP
  distance: number;
  duration: string;
  speed: string;
  pace_numeric: number;
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

function parseDuration(durationStr: string): number {
  // Parse duration string (e.g., "00:32:15" or "32:15") to minutes
  const parts = durationStr.split(':');
  if (parts.length === 3) {
    // HH:MM:SS
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return hours * 60 + minutes + Math.round(seconds / 60);
  } else if (parts.length === 2) {
    // MM:SS
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return minutes + Math.round(seconds / 60);
  }
  // Fallback: try to parse as number
  return Math.round(parseFloat(durationStr));
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
        activityname,
        starttimelocal,
        distance,
        duration,
        speed,
        pace_numeric
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_data4__list_activities\`
      ORDER BY starttimelocal DESC
      LIMIT 10
    `;

    const [rows] = await bigquery.query(query);

    // Map BigQuery data to frontend format
    const activities: Activity[] = rows.map((row: BigQueryActivity, index: number) => {
      const timestamp = typeof row.starttimelocal === 'object'
        ? row.starttimelocal.value
        : row.starttimelocal;

      return {
        id: `${timestamp}_${index}`, // Generate unique ID from timestamp
        title: row.activityname || 'Activité',
        distance: row.distance || 0,
        duration: parseDuration(row.duration),
        date: formatDate(timestamp),
        type: 'running', // Default type, could be enhanced later
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
