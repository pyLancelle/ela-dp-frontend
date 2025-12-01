import { NextResponse } from 'next/server';
import { bigquery } from '@/lib/bigquery';
import { SleepBodyBatteryRow, SleepBodyBatteryData } from '@/types/dashboard';

export async function GET() {
  try {
    const query = `
      SELECT
        date,
        day_abbr_french,
        sleep_score,
        battery_at_bedtime,
        battery_at_waketime,
        battery_gain
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__sleep_body_battery\`
      ORDER BY date ASC
    `;

    const [rows] = await bigquery.query(query);
    const data = rows as SleepBodyBatteryRow[];

    // Calculer la moyenne des scores de sommeil
    const validSleepScores = data.filter(row => row.sleep_score !== null);
    const averageSleepScore = validSleepScores.length > 0
      ? Math.round(validSleepScores.reduce((sum, row) => sum + row.sleep_score, 0) / validSleepScores.length)
      : 0;

    // Calculer le max delta de body battery
    const validDeltas = data.filter(row => row.battery_gain !== null);
    const averageDelta = validDeltas.length > 0
      ? Math.round(validDeltas.reduce((sum, row) => sum + row.battery_gain, 0) / validSleepScores.length)
      : 0;

    // Formater les données pour les composants
    const response: SleepBodyBatteryData = {
      sleepScores: {
        average: averageSleepScore,
        daily: data.map(row => ({
          day: row.day_abbr_french || '',
          score: row.sleep_score || 0,
          date: row.date
        }))
      },
      bodyBattery: {
        average: averageDelta,
        daily: data.map(row => ({
          day: row.day_abbr_french || '',
          range: [row.battery_at_bedtime || 0, row.battery_at_waketime || 0] as [number, number],
          delta: row.battery_gain || 0,
          date: row.date
        }))
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching sleep and body battery data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sleep and body battery data' },
      { status: 500 }
    );
  }
}
