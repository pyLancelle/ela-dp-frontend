import { NextRequest } from "next/server";
import { cachedResponse } from "@/lib/api/response";
import { SLEEP_OVERVIEW_MOCK } from "@/lib/mock/sleep-mock";

const GCS_SLEEP_URL =
  "https://storage.googleapis.com/ela-dp-export/sleep_overview.json";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(GCS_SLEEP_URL, { cache: "no-store" });

    if (!response.ok) {
      console.warn(
        `GCS sleep_overview.json not available (${response.status}), serving mock data`
      );
      return cachedResponse(SLEEP_OVERVIEW_MOCK);
    }

    const data = await response.json();
    return cachedResponse(data);
  } catch (error) {
    console.warn("GCS sleep fetch failed, serving mock data:", error);
    return cachedResponse(SLEEP_OVERVIEW_MOCK);
  }
}
