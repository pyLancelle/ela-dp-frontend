import { NextResponse } from 'next/server';
import { bigquery } from '@/lib/bigquery';

export async function GET() {
  try {
    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__sleep_stages\`
      ORDER BY 1,2
    `;

    const [rows] = await bigquery.query(query);

    // Mapper les stages aux noms attendus par le composant
    const mappedData = rows.map((row: any) => {
      let stage = row.level_name;

      // Convertir les noms de stages
      if (stage === 'light') {
        stage = 'core';
      } else if (stage === 'awake_restless') {
        stage = 'awake';
      }

      return {
        startTime: row.start_time.value, // BigQuery Timestamp
        endTime: row.end_time.value,
        stage: stage
      };
    });

    return NextResponse.json(mappedData);
  } catch (error) {
    console.error('Error fetching sleep stages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sleep stages' },
      { status: 500 }
    );
  }
}
