import { NextRequest } from 'next/server';
import { cachedResponse, errorResponse } from '@/lib/api/response';

const GCS_BASE_URL = 'https://storage.googleapis.com/ela-dp-export';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || id.length < 5) {
      return errorResponse('Invalid artist ID', 400);
    }

    const response = await fetch(`${GCS_BASE_URL}/artist_focus/${id}.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return errorResponse('Artist not found', 404);
      }
      const errorText = await response.text();
      console.error(`GCS artist focus fetch failed (${id}):`, errorText);
      throw new Error(`Failed to fetch artist_focus/${id}.json from GCS`);
    }

    const data = await response.json();

    return cachedResponse(data, 'musicClassement');
  } catch (error) {
    console.error('Error fetching artist focus detail:', error);
    return errorResponse('Failed to fetch artist focus detail');
  }
}
