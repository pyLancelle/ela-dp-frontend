// app/api/homepage/route.ts
import { NextResponse, NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    // Call the consolidated FastAPI backend endpoint
    const response = await fetch(`${API_BASE_URL}/api/homepage`);

    if (!response.ok) {
      throw new Error('API call to homepage endpoint failed');
    }

    const data = await response.json();

    // Return the consolidated response
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    );
  }
}
