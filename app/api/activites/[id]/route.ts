import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';
import path from 'path';

// Use credentials from file in development, env var in production
let bigquery: BigQuery;

if (process.env.NODE_ENV === 'development') {
  bigquery = new BigQuery({
    projectId: 'polar-scene-465223-f7',
    keyFilename: path.join(process.cwd(), 'gcs_key.json'),
  });
} else {
  let credentials;
  try {
    credentials = process.env.GCS_KEY ? JSON.parse(process.env.GCS_KEY) : undefined;
  } catch (error) {
    console.error('Error parsing GCS_KEY:', error);
  }

  bigquery = new BigQuery({
    projectId: 'polar-scene-465223-f7',
    credentials,
  });
}

// BigQuery interfaces matching the view structure
interface FastestSplits {
  fastestSplit_1000: number | null;
  fastestSplit_1609: number | null;
  fastestSplit_5000: number | null;
  fastestSplit_10000: number | null;
  fastestSplit_21098: number | null;
  fastestSplit_42195: number | null;
}

interface HRZones {
  hrTimeInZone_1: number | null;
  hrTimeInZone_2: number | null;
  hrTimeInZone_3: number | null;
  hrTimeInZone_4: number | null;
  hrTimeInZone_5: number | null;
}

interface PowerZones {
  powerTimeInZone_1: number | null;
  powerTimeInZone_2: number | null;
  powerTimeInZone_3: number | null;
  powerTimeInZone_4: number | null;
  powerTimeInZone_5: number | null;
}

interface KilometerLap {
  lapIndex: number | null;
  startTimeGMT: string | null;
  distance: number | null;
  duration: number | null;
  averageSpeed: number | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
}

interface TrainingInterval {
  startTimeGMT: string | null;
  distance: number | null;
  duration: number | null;
  averageSpeed: number | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
}

interface TrackPlayed {
  played_at: { value: string } | null;
  track_name: string | null;
  artists: string | null;
  album_name: string | null;
  album_image: string | null;
  duration_ms: number | null;
  track_url: string | null;
}

export interface Activity {
  activityId: number;
  activityName: string;
  startTimeGMT: string;
  endTimeGMT: string;
  typeKey: string;
  distance: number | null;
  duration: number | null;
  elapsedDuration: number | null;
  elevationGain: number | null;
  elevationLoss: number | null;
  averageSpeed: number | null;
  hasPolyline: boolean | null;
  calories: number | null;
  averageHR: number | null;
  maxHR: number | null;
  aerobicTrainingEffect: number | null;
  anaerobicTrainingEffect: number | null;
  minElevation: number | null;
  maxElevation: number | null;
  activityTrainingLoad: number | null;
  fastestSplits: FastestSplits | null;
  hr_zones: HRZones | null;
  power_zones: PowerZones | null;
  kilometer_laps: KilometerLap[] | null;
  training_intervals: TrainingInterval[] | null;
  tracks_played: TrackPlayed[] | null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;

    // If id is "last" or any non-numeric value, get the most recent activity
    let query: string;
    const numericId = parseInt(activityId, 10);

    if (activityId === 'last' || isNaN(numericId)) {
      query = `
        SELECT *
        FROM \`polar-scene-465223-f7.dp_product_dev.pct_activites__last_run\`
        LIMIT 1
      `;
    } else {
      query = `
        SELECT *
        FROM \`polar-scene-465223-f7.dp_product_dev.pct_activites__last_run\`
        WHERE activityId = ${numericId}
        LIMIT 1
      `;
    }

    console.log('Querying BigQuery for activity:', activityId);
    const [rows] = await bigquery.query(query);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    const activity: Activity = rows[0];

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
