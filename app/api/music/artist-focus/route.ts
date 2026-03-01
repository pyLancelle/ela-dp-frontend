import { cachedResponse, errorResponse } from '@/lib/api/response';

const GCS_BASE_URL = 'https://storage.googleapis.com/ela-dp-export';

export async function GET() {
  try {
    const response = await fetch(`${GCS_BASE_URL}/artist_focus/index.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GCS artist focus index fetch failed:', errorText);
      throw new Error('Failed to fetch artist_focus/index.json from GCS');
    }

    const data = await response.json();

    return cachedResponse(data, 'musicClassement');
  } catch (error) {
    console.error('Error fetching artist focus index:', error);
    return errorResponse('Failed to fetch artist focus index');
  }
}
