// app/api/homepage/route.ts
import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const GCS_HOMEPAGE_URL = 'https://storage.googleapis.com/ela-dp-export/homepage.json';

export async function GET(request: NextRequest) {
  try {
    // Fetch homepage data from GCS static JSON export
    const response = await fetch(GCS_HOMEPAGE_URL, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GCS homepage fetch failed with status ${response.status}:`, errorText);
      throw new Error(`Failed to fetch homepage.json from GCS: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return the consolidated response with cache headers
    return cachedResponse(data, 'homepage');

  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return errorResponse('Failed to fetch homepage data');
  }
}
