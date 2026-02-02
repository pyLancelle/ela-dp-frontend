// app/api/vo2max-trend/route.ts
import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Call the FastAPI backend endpoint for VO2max trend
    const response = await fetch(`${API_BASE_URL}/api/homepage/vo2max-trend`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`VO2max trend API failed with status ${response.status}:`, errorText);
      throw new Error(`API call to vo2max-trend endpoint failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Return the response with cache headers (1hr fresh, 2hr stale)
    return cachedResponse(data, 'activityDetail');

  } catch (error) {
    console.error('Error fetching VO2max trend data:', error);
    return errorResponse('Failed to fetch VO2max trend data');
  }
}
