import { bigquery } from '@/lib/bigquery';
import { NextResponse } from 'next/server';
import { RunningWeeklyData, RunningWeeklyRow } from '@/types/dashboard';

export async function GET() {
    try {
        // Query the dedicated BigQuery view for running weekly stats
        const query = `
            SELECT
                date,
                day_of_week,
                total_distance_km,
                aerobic_score,
                anaerobic_score
            FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__running_weekly\`
            ORDER BY date DESC
            LIMIT 7
        `;

        const [rows] = await bigquery.query(query);
        const weeklyRows = rows as RunningWeeklyRow[];

        console.log('Running weekly rows:', weeklyRows);

        if (weeklyRows.length === 0) {
            return NextResponse.json({
                generatedAt: new Date().toISOString(),
                totalDistance: 0,
                sessionCount: 0,
                averagePerSession: 0,
                daily: []
            } as RunningWeeklyData);
        }

        // Reverse to have oldest to newest for display
        const sortedRows = [...weeklyRows].reverse();

        // Calculate aggregated stats
        const totalDistance = weeklyRows.reduce((sum, row) => sum + (row.total_distance_km || 0), 0);
        const sessionCount = weeklyRows.filter(row => row.total_distance_km > 0).length;
        const averagePerSession = sessionCount > 0 ? totalDistance / sessionCount : 0;

        // Find max scores for percentage calculation
        const maxAerobic = Math.max(...weeklyRows.map(row => row.aerobic_score || 0), 5);
        const maxAnaerobic = Math.max(...weeklyRows.map(row => row.anaerobic_score || 0), 5);

        // Format daily data for chart
        const daily = sortedRows.map(row => {
            const aerobicHeightPercentage = maxAerobic > 0 ? (row.aerobic_score / maxAerobic) * 100 : 0;
            const anaerobicHeightPercentage = maxAnaerobic > 0 ? (row.anaerobic_score / maxAnaerobic) * 100 : 0;

            return {
                day: row.day_of_week,
                date: row.date,
                distance: row.total_distance_km || 0,
                aerobicScore: row.aerobic_score || 0,
                anaerobicScore: row.anaerobic_score || 0,
                aerobicHeightPercentage,
                anaerobicHeightPercentage
            };
        });

        const response: RunningWeeklyData = {
            generatedAt: new Date().toISOString(),
            totalDistance: Math.round(totalDistance * 10) / 10,
            sessionCount,
            averagePerSession: Math.round(averagePerSession * 10) / 10,
            daily
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching running weekly data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch running weekly data' },
            { status: 500 }
        );
    }
}
