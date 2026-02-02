// app/api/homepage/route.ts
import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Call the consolidated FastAPI backend endpoint
    const response = await fetch(`${API_BASE_URL}/api/homepage`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Homepage API failed with status ${response.status}:`, errorText);
      throw new Error(`API call to homepage endpoint failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return the consolidated response with cache headers
    return cachedResponse(data, 'homepage');

  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return errorResponse('Failed to fetch homepage data');
  }
}
