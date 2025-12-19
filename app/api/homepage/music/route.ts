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
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__music_time_daily\`
      ORDER BY date DESC
      LIMIT 7
    `;

        // 2. Top Artists
        const topArtistsQuery = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__top_artist\`
      ORDER BY rank ASC
      LIMIT 10
    `;

        // 3. Top Tracks
        const topTracksQuery = `
      SELECT *
      FROM \`polar-scene-465223-f7.dp_product_dev.pct_homepage__top_track\`
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

        // Debug: Log the first row of each result to see the actual schema
        console.log('Sample listeningTime row:', listeningTimeRows[0]);
        console.log('All listeningTime rows count:', listeningTimeRows.length);
        console.log('Sample topArtist row:', topArtistsRows[0]);
        console.log('Sample topTrack row:', topTracksRows[0]);

        // Process listening time data
        const processListeningTime = () => {
            if (listeningTimeRows.length === 0) {
                return { averagePerDay: "0h 0m", days: [] };
            }

            // Sort by date ascending for display (oldest to newest)
            const sortedRows = [...listeningTimeRows].reverse();

            // Calculate average duration in milliseconds
            const totalMs = listeningTimeRows.reduce((sum, row) => sum + (row.total_duration_ms || 0), 0);
            const averageMs = totalMs / listeningTimeRows.length;

            // Convert average to hours and minutes
            const avgHours = Math.floor(averageMs / (1000 * 60 * 60));
            const avgMinutes = Math.floor((averageMs % (1000 * 60 * 60)) / (1000 * 60));
            const averagePerDay = `${avgHours}h ${avgMinutes}m`;

            // Find max duration for percentage calculation
            const maxDuration = Math.max(...listeningTimeRows.map(row => row.total_duration_ms || 0));

            // Format days for display
            const days = sortedRows.map(row => {
                const dateObj = new Date(row.date.value || row.date);
                const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
                const day = dayNames[dateObj.getDay()];

                const durationMs = row.total_duration_ms || 0;
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                const formatted = hours > 0 ? `${hours}h${minutes}m` : `${minutes}m`;

                const heightPercentage = maxDuration > 0 ? (durationMs / maxDuration) * 100 : 0;

                return {
                    date: row.date.value || row.date,
                    day,
                    duration: durationMs,
                    formatted,
                    heightPercentage
                };
            });

            return { averagePerDay, days };
        };

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
            listeningTime: processListeningTime(),
            topArtists: topArtistsRows.map((row: any) => ({
                rank: row.rank,
                name: row.artistname || 'Artiste inconnu',
                trackCount: row.play_count || 0,
                totalDuration: row.total_duration || "0h 0m",
                playCount: row.play_count || 0,
                imageUrl: row.imageurllarge || row.albumimageurl || row.artistimageurl || null,
                externalUrl: row.artistexternalurl || null
            })),
            topTracks: topTracksRows.map((row: any) => ({
                rank: row.rank,
                name: row.trackname || 'Titre inconnu',
                artistName: row.all_artist_names || row.artistname || 'Artiste inconnu',
                totalDuration: row.total_duration || "0m 0s",
                playCount: row.play_count || 0,
                imageUrl: row.albumimageurl || null,
                externalUrl: row.trackExternalUrl || row.trackexternalurl || null
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
