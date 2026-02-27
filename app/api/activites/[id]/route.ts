import { cachedResponse, errorResponse } from '@/lib/api/response';

const GCS_BASE_URL = 'https://storage.googleapis.com/ela-dp-export';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;

    const response = await fetch(`${GCS_BASE_URL}/activity_${activityId}.json`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return errorResponse('Activity not found', 404);
      }
      const errorText = await response.text();
      console.error(`GCS activity detail fetch failed (${activityId}):`, errorText);
      throw new Error(`Failed to fetch activity ${activityId} from GCS: ${response.status}`);
    }

    const data = await response.json();
    return cachedResponse(data, 'activityDetail');
  } catch (error) {
    console.error('Error fetching activity:', error);
    return errorResponse(
      `Failed to fetch activity: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
