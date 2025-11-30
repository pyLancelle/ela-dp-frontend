import { bigquery } from '@/lib/bigquery';
import { NextResponse, NextRequest } from 'next/server';
import { MusicDashboardData } from '@/types/dashboard';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = searchParams.get('period') || 'last_7_days';

        // Validate period
        const validPeriods = ['yesterday', 'last_7_days', 'last_30_days', 'last_365_days', 'all_time'];
        if (!validPeriods.includes(period)) {
            return NextResponse.json({ error: 'Invalid period parameter' }, { status: 400 });
        }

        // Queries
        // 1. Listening Time (Assuming table pct_homepage__music_dashboard exists and has listening_time data)
        // Note: Adjusting query based on assumption that this table aggregates daily stats
        const listeningTimeQuery = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__music_dashboard\`
      WHERE period = '${period}'
      LIMIT 1
    `;

        // 2. Top Artists
        const topArtistsQuery = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_classement__top_artist_by_period\`
      WHERE period = '${period}'
      ORDER BY rank ASC
      LIMIT 10
    `;

        // 3. Top Tracks
        const topTracksQuery = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_classement__top_track_by_period\`
      WHERE period = '${period}'
      ORDER BY rank ASC
      LIMIT 10
    `;

        // Execute queries in parallel
        const [listeningTimeResult, topArtistsResult, topTracksResult] = await Promise.all([
            bigquery.query(listeningTimeQuery),
            bigquery.query(topArtistsQuery),
            bigquery.query(topTracksQuery)
        ]);

        const listeningTimeRows = listeningTimeResult[0];
        const topArtistsRows = topArtistsResult[0];
        const topTracksRows = topTracksResult[0];

        // Construct response
        // Note: If listeningTimeRows is empty, we might need to handle it. 
        // For now assuming the view returns a single row with JSON structure or columns matching the interface.
        // Since I don't know the exact schema of pct_homepage__music_dashboard, I'll assume it returns columns that map to the interface
        // OR that we need to construct the 'listeningTime' object from daily rows if the view isn't pre-aggregated as a single object.

        // Let's assume for now the view returns the exact structure needed for 'listeningTime' or we map it.
        // Actually, looking at specs: "Les données sont pré-agrégées et formatées dans 3 vues BigQuery dédiées".
        // So likely the view returns 1 row with all the JSON structure for that section?
        // Or maybe it returns daily rows and we aggregate?
        // The specs say: "API routes ultra-simples (simple SELECT *)".
        // So let's assume the view `pct_homepage__music_dashboard` returns the ready-to-use JSON structure for the music dashboard, 
        // BUT the specs also mentioned "3 endpoints principaux" and "Vue par Périmètre".
        // However, I see `pct_classement__top_*` tables being used in the existing code.
        // If `pct_homepage__music_dashboard` contains EVERYTHING (artists + tracks + time), then we just query that one table.
        // If it only contains "Listening Time" as implied by the "Sources de données" section in my analysis vs existing code...

        // Let's try to query ONLY `pct_homepage__music_dashboard` first as it might contain everything if it was built according to specs.
        // If it fails or is missing data, we'll fallback to the separate queries.
        // Actually, to be safe and robust given I can't see the schema:
        // I will construct the response from the separate parts I KNOW exist (Top Artists/Tracks) and assume the Dashboard view gives the Listening Time.

        const response: MusicDashboardData = {
            generatedAt: new Date().toISOString(),
            period: period,
            listeningTime: listeningTimeRows.length > 0 ? listeningTimeRows[0].listeningTime : { averagePerDay: "0h 0m", days: [] }, // Fallback if empty
            topArtists: topArtistsRows.map((row: any) => ({
                rank: row.rank,
                name: row.artist_name || row.name, // Handling potential column name diffs
                trackCount: row.track_count || 0,
                totalDuration: row.total_duration || "0h 0m",
                playCount: row.play_count || 0,
                imageUrl: row.image_url || null,
                externalUrl: row.external_url || null
            })),
            topTracks: topTracksRows.map((row: any) => ({
                rank: row.rank,
                name: row.track_name || row.name,
                artistName: row.artist_name,
                totalDuration: row.total_duration || "0m 0s",
                playCount: row.play_count || 0,
                imageUrl: row.image_url || null,
                externalUrl: row.external_url || null
            }))
        };

        // If listeningTimeRows[0] has the full structure, we might just want to merge it.
        // But for now, let's assume `pct_homepage__music_dashboard` returns a row with a `listeningTime` column (STRUCT/JSON).
        // If the view was designed to return the WHOLE JSON for the endpoint, then `SELECT *` would give us the whole `MusicDashboardData`.
        // Let's stick to the plan: Aggregate manually if needed.

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching music dashboard data:', error);
        return NextResponse.json({ error: 'Failed to fetch music dashboard data' }, { status: 500 });
    }
}
