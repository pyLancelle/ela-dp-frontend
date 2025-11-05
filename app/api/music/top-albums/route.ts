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

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_data4__top_album\`
      ORDER BY rank
      LIMIT 20
    `;

    const [rows] = await bigquery.query(query);

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching top albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top albums' },
      { status: 500 }
    );
  }
}
