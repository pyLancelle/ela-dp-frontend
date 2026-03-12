import { NextRequest } from "next/server";
import { cachedResponse } from "@/lib/api/response";
import { getSleepNightMock } from "@/lib/mock/sleep-mock";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;

  const GCS_URL = `https://storage.googleapis.com/ela-dp-export/sleep_night_${date}.json`;

  try {
    const response = await fetch(GCS_URL, { cache: "no-store" });

    if (!response.ok) {
      console.warn(
        `GCS sleep_night_${date}.json not available (${response.status}), serving mock data`
      );
      return cachedResponse(getSleepNightMock(date));
    }

    const data = await response.json();
    return cachedResponse(data);
  } catch (error) {
    console.warn("GCS sleep night fetch failed, serving mock data:", error);
    return cachedResponse(getSleepNightMock(date));
  }
}
