// app/api/music/music-classement/route.ts
import { NextResponse, NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all_time';
    const limit = searchParams.get('limit') || '20';

    // Grouped API calls to FastAPI backend
    const [tracksResponse, artistsResponse, albumsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/music/top-tracks?period=${period}&limit=${limit}`),
      fetch(`${API_BASE_URL}/api/music/top-artists?period=${period}&limit=${limit}`),
      fetch(`${API_BASE_URL}/api/music/top-albums?period=${period}&limit=${limit}`),
    ]);

    if (!tracksResponse.ok || !artistsResponse.ok || !albumsResponse.ok) {
      throw new Error('One or more API calls failed');
    }

    const [top_tracks, top_artists, top_albums] = await Promise.all([
      tracksResponse.json(),
      artistsResponse.json(),
      albumsResponse.json(),
    ]);

    // Return grouped response
    return NextResponse.json({
      top_tracks,
      top_artists,
      top_albums,
    });

  } catch (error) {
    console.error('Error fetching music classement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music classement' },
      { status: 500 }
    );
  }
}
