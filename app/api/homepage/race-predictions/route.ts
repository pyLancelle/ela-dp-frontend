import { bigquery } from '@/lib/bigquery';
import { NextResponse } from 'next/server';
import { RacePredictionsData } from '@/types/dashboard';

function formatTime(seconds: number | string): string {
    // Convert to number if it's a string
    const totalSeconds = typeof seconds === 'string' ? parseInt(seconds, 10) : seconds;

    if (isNaN(totalSeconds)) {
        return '0:00';
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatDifference(diffSeconds: number | string): string {
    // Convert to number if it's a string
    const diff = typeof diffSeconds === 'string' ? parseInt(diffSeconds, 10) : diffSeconds;

    if (isNaN(diff)) {
        return '0:00';
    }

    const absDiff = Math.abs(diff);
    const minutes = Math.floor(absDiff / 60);
    const secs = Math.floor(absDiff % 60);

    // Positive diff = slower time = regression = show as +X:XX in red
    // Negative diff = faster time = improvement = show as -X:XX in green
    const sign = diff >= 0 ? '+' : '-';
    return `${sign}${minutes}:${secs.toString().padStart(2, '0')}`;
}

export async function GET() {
    try {
        // Query the dedicated BigQuery view for race predictions
        const query = `
            SELECT
                distance,
                current_date,
                current_time,
                previous_date,
                previous_time,
                diff_seconds
            FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__race_prediction\`
            ORDER BY
                CASE distance
                    WHEN '5K' THEN 1
                    WHEN '10K' THEN 2
                    WHEN '21K' THEN 3
                    WHEN '42K' THEN 4
                END
        `;

        const [rows] = await bigquery.query(query);
        const predictionRows = rows as any[];

        if (predictionRows.length === 0) {
            return NextResponse.json({
                generatedAt: new Date().toISOString(),
                predictions: []
            } as RacePredictionsData);
        }

        // Format the predictions for the UI
        const predictions = predictionRows.map(row => {
            // Use current_time if available, otherwise calculate it
            const currentTime = row.current_time || (row.previous_time + row.diff_seconds);

            return {
                distance: row.distance,
                time: formatTime(currentTime),
                difference: formatDifference(row.diff_seconds),
                isImprovement: row.diff_seconds < 0,
                diffSeconds: row.diff_seconds
            };
        });

        const response: RacePredictionsData = {
            generatedAt: new Date().toISOString(),
            predictions
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching race predictions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch race predictions' },
            { status: 500 }
        );
    }
}
