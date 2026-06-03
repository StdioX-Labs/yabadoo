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
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ status: false, message: 'Promo code is required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/promocodes/validate/${code}`, {
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
      data = { status: false, message: 'Invalid response from server' };
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: false, message: 'Failed to validate promo code', error: errorMessage }, { status: 500 });
  }
}
