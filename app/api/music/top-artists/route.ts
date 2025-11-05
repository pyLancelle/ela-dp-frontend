import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

const credentials = process.env.GCS_KEY ? JSON.parse(process.env.GCS_KEY) : undefined;

const bigquery = new BigQuery({
  projectId: 'polar-scene-465223-f7',
  credentials,
});

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_data4__top_artist\`
      ORDER BY rank
      LIMIT 20
    `;

    const [rows] = await bigquery.query(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top artists' },
      { status: 500 }
    );
  }
}
