import { bigquery } from '@/lib/bigquery';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all_time';

    // Validate period to prevent SQL injection
    const validPeriods = ['yesterday', 'last_7_days', 'last_30_days', 'last_365_days', 'all_time'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period parameter' },
        { status: 400 }
      );
    }

    const query = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_classement__top_artist_by_period\`
      WHERE period = '${period}'
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
