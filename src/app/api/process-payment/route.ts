import { NextResponse } from 'next/server';

/**
 * Paystack Payment Processing API
 *
 * This endpoint processes a successful Paystack payment and generates tickets.
 * Called after Paystack payment is completed on the client side.
 *
 * Endpoint: POST /api/process-payment
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
    const {
      reference,
      eventId,
      tickets,
      customerName,
      email,
      phoneNumber,
      amount,
    } = body;

    // Validate required fields
    if (!reference || !eventId || !tickets || !customerName || !email || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse customer name
    const nameParts = customerName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    console.log('🔄 Processing Paystack payment:', {
      reference,
      eventId,
      amount,
      email,
    });

    // Prepare payload in SoldOutAfrica format
    const payload = {
      eventId: eventId,
      amountDisplayed: amount,
      coupon_code: "",
      channel: "card",
      customer: {
        mobile_number: phoneNumber || "",
        email: email,
        first_name: firstName,
        last_name: lastName,
      },
      tickets: tickets.map((ticket: any) => ({
        ticketId: ticket.ticketId,
        quantity: ticket.quantity,
      })),
    };

    console.log('📦 Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(`${BASE_URL}/tickets/purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': createAuthHeader(),
      },
      body: JSON.stringify(payload),
    });

    console.log('📡 Payment Processing API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Payment processing failed:', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process payment',
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Payment processed successfully, tickets generated');
    console.log('📨 Response:', data);

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully. Tickets sent to your email.',
      data,
    });

  } catch (error) {
    console.error('💥 Error processing payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process payment',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

