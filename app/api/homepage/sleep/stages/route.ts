import { NextResponse } from 'next/server';
import { bigquery } from '@/lib/bigquery';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '2025-11-28'; // Date par défaut

    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__sleep_stages\`
      WHERE DATE(start_time) = @date
      ORDER BY start_time ASC
    `;

    const options = {
      query: query,
      params: { date: date },
    };

    const [rows] = await bigquery.query(options);

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
