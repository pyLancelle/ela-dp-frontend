import { cachedResponse, errorResponse } from '@/lib/api/response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;

    const isLast = activityId === 'last' || isNaN(parseInt(activityId, 10));
    const endpoint = isLast
      ? `${API_BASE_URL}/api/activities/detail/last`
      : `${API_BASE_URL}/api/activities/detail/${activityId}`;

    const response = await fetch(endpoint, { cache: 'no-store' });

    if (!response.ok) {
      if (response.status === 404) {
        return errorResponse('Activity not found', 404);
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return cachedResponse(data, isLast ? 'activityLast' : 'activityDetail');
  } catch (error) {
    console.error('Error fetching activity:', error);
    return errorResponse(
      `Failed to fetch activity: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
