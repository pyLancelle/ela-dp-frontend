import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Construire les query params pour le backend
    const params = new URLSearchParams();

    const page = searchParams.get('page');
    const pageSize = searchParams.get('pageSize');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const timeFrom = searchParams.get('timeFrom');
    const timeTo = searchParams.get('timeTo');
    const artist = searchParams.get('artist');

    if (page) params.append('page', page);
    if (pageSize) params.append('pageSize', pageSize);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    if (timeFrom) params.append('timeFrom', timeFrom);
    if (timeTo) params.append('timeTo', timeTo);
    if (artist) params.append('artist', artist);

    const response = await fetch(
      `${API_BASE_URL}/api/music/recently-played?${params.toString()}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    const data = await response.json();

    return cachedResponse(data, 'recentlyPlayed');

  } catch (error) {
    console.error('Error fetching recently played:', error);
    return errorResponse('Failed to fetch recently played tracks');
  }
}
