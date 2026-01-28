import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.soldoutafrica.com/api/v1';
const API_USERNAME = process.env.API_USERNAME || '254717286026';
const API_PASSWORD = process.env.API_PASSWORD || 's0ascAnn3r@56YearsLater!';

const createAuthHeader = () => {
  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json(
      { success: false, error: 'Event ID parameter is required' },
      { status: 400 }
    );
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log('🔄 Fetching event by ID:', eventId);

    const response = await fetch(`${BASE_URL}/event/get?eventId=${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': createAuthHeader(),
      },
      cache: 'no-store',
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API response not OK:', response.status, response.statusText);

      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch event (Status: ${response.status})`,
          details: errorText,
        },
        { status: response.status, headers }
      );
    }

    const data = await response.json();
    console.log('✅ Event fetched successfully:', data.event?.eventName || 'Unknown');

    return NextResponse.json({
      success: true,
      event: data.event,
    }, { headers });

  } catch (error) {
    console.error('💥 Error fetching event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch event',
        details: errorMessage,
      },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

