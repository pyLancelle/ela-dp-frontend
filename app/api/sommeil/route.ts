import { NextRequest } from "next/server";
import { cachedResponse } from "@/lib/api/response";
import { SLEEP_MOCK_DATA } from "@/lib/mock/sleep-mock";

const GCS_SLEEP_URL =
  "https://storage.googleapis.com/ela-dp-export/sleep.json";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(GCS_SLEEP_URL, { cache: "no-store" });

    if (!response.ok) {
      // GCS file not available yet — serve mock data
      console.warn(
        `GCS sleep.json not available (${response.status}), serving mock data`
      );
      return cachedResponse(SLEEP_MOCK_DATA);
    }

    const data = await response.json();
    return cachedResponse(data);
  } catch (error) {
    // Network error — serve mock data as fallback
    console.warn("GCS sleep fetch failed, serving mock data:", error);
    return cachedResponse(SLEEP_MOCK_DATA);
  }
}
