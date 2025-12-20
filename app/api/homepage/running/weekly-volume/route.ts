import { bigquery } from '@/lib/bigquery';
import { NextResponse } from 'next/server';
import { RunningWeeklyVolumeData } from '@/types/dashboard';

interface BigQueryRow {
    week_start: { value: string };
    number_of_runs: number;
    total_distance_km: number;
}

export async function GET() {
    try {
        // Query the dedicated BigQuery view for running weekly volume (last 10 weeks)
        const query = `
            SELECT
                week_start,
                number_of_runs,
                total_distance_km
            FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__running_weekly_volume\`
            ORDER BY week_start DESC
            LIMIT 10
        `;

        const [rows] = await bigquery.query(query);
        const volumeRows = rows as BigQueryRow[];

        console.log('Running weekly volume rows:', volumeRows);

        if (volumeRows.length === 0) {
            return NextResponse.json({
                generatedAt: new Date().toISOString(),
                average: 0,
                max: 0,
                weeks: []
            } as RunningWeeklyVolumeData);
        }

        // Reverse to have oldest to newest for display
        const sortedRows = [...volumeRows].reverse();

        // Calculate stats
        const totalVolume = volumeRows.reduce((sum, row) => sum + (row.total_distance_km || 0), 0);
        const average = totalVolume / volumeRows.length;
        const max = Math.max(...volumeRows.map(row => row.total_distance_km || 0));

        // Determine current week (most recent week_start)
        const mostRecentWeek = volumeRows[0].week_start.value;

        // Format weeks data for chart
        const weeks = sortedRows.map((row, index) => {
            // Generate week label (S-9, S-8, ... S0 for current week)
            const weeksFromNow = sortedRows.length - 1 - index;
            const isCurrent = row.week_start.value === mostRecentWeek;
            const weekLabel = isCurrent ? 'S0' : `S-${weeksFromNow}`;

            // Extract week number and year from date
            const weekStartDate = new Date(row.week_start.value);
            const weekNumber = getWeekNumber(weekStartDate);
            const year = weekStartDate.getFullYear();

            return {
                week: weekLabel,
                volume: Math.round(row.total_distance_km * 10) / 10,
                isCurrent,
                weekNumber,
                year,
                startDate: row.week_start.value
            };
        });

        const response: RunningWeeklyVolumeData = {
            generatedAt: new Date().toISOString(),
            average: Math.round(average * 10) / 10,
            max: Math.round(max * 10) / 10,
            weeks
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching running weekly volume data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch running weekly volume data' },
            { status: 500 }
        );
    }
}

// Helper function to get ISO week number
function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
