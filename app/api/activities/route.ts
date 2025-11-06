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

export interface Activity {
  id: string;
  title: string;
  distance: number;
  duration: number;
  date: string;
  type: string;
}

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_data4__list_activities\`
      ORDER BY date DESC
      LIMIT 10
    `;

    const [rows] = await bigquery.query(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
