import { NextResponse } from 'next/server';

const BASE_URL = 'https://soldoutafrica.com/api';
const API_USERNAME = process.env.API_USERNAME || '254717286026';
const API_PASSWORD = process.env.API_PASSWORD || 's0ascAnn3r@56YearsLater!';

const createAuthHeader = () => {
  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');
  return `Basic ${credentials}`;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ trxref: string }> }
) {
  try {
    const { trxref } = await params;

    if (!trxref) {
      return NextResponse.json({ status: false, message: 'Transaction reference is required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/event/ticket/group/${trxref}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': createAuthHeader(),
      },
    });

    let data: Record<string, unknown>;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from SoldOutAfrica:', text);
      data = { status: false, message: 'Invalid response from payment provider' };
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('Error fetching ticket group:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: false, message: 'Failed to fetch ticket status', error: errorMessage }, { status: 500 });
  }
}
