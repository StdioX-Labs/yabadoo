import { NextResponse } from 'next/server';

/**
 * SoldOutAfrica Tickets Purchase API
 *
 * This endpoint handles ticket purchases for both M-Pesa and Card payments
 * by forwarding the request to the SoldOutAfrica API.
 *
 * Endpoint: POST /api/tickets/purchase
 */

const BASE_URL = 'https://soldoutafrica.com/api';
const API_USERNAME = process.env.API_USERNAME || '254717286026';
const API_PASSWORD = process.env.API_PASSWORD || 's0ascAnn3r@56YearsLater!';

const createAuthHeader = () => {
  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('🔄 Processing ticket purchase request');
    console.log('📦 Request payload:', JSON.stringify(body, null, 2));

    // Validate required fields
    const { eventId, amountDisplayed, channel, customer, tickets } = body;

    if (!eventId || !amountDisplayed || !channel || !customer || !tickets) {
      return NextResponse.json(
        {
          status: false,
          message: 'Missing required fields',
          error: 'eventId, amountDisplayed, channel, customer, and tickets are required'
        },
        { status: 400 }
      );
    }

    // Forward the request to SoldOutAfrica API
    const response = await fetch(`${BASE_URL}/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': createAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    console.log('📡 SoldOutAfrica API Response Status:', response.status);

    // Get the response data
    let data: Record<string, unknown>;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text);
      data = { status: false, message: 'Invalid response from payment provider' };
    }

    console.log('📨 SoldOutAfrica API Response Data:', data);

    // Forward the response to the client
    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        data,
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('💥 Error processing ticket purchase:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        status: false,
        message: 'Failed to process ticket purchase',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

