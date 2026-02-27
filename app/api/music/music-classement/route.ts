// app/api/music/music-classement/route.ts
import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const GCS_BASE_URL = 'https://storage.googleapis.com/ela-dp-export';

const VALID_PERIODS = ['yesterday', 'last_7_days', 'last_30_days', 'last_365_days', 'all_time'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'all_time';

    if (!VALID_PERIODS.includes(period)) {
      return errorResponse(`Invalid period: ${period}`, 400);
    }

    const response = await fetch(`${GCS_BASE_URL}/music_classement_${period}.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GCS music classement fetch failed (${period}):`, errorText);
      throw new Error(`Failed to fetch music_classement_${period}.json from GCS`);
    }

    const data = await response.json();

    return cachedResponse(data, 'musicClassement');

  } catch (error) {
    console.error('Error fetching music classement:', error);
    return errorResponse('Failed to fetch music classement');
  }
}
