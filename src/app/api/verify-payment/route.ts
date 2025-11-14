import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error('Paystack secret key not configured');
      return NextResponse.json(
        { error: 'Payment verification unavailable' },
        { status: 500 }
      );
    }

    // Verify payment with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Payment verification failed', details: data },
        { status: response.status }
      );
    }

    // Check if payment was successful
    if (data.data.status === 'success') {
      // Here you would typically:
      // 1. Save transaction to database
      // 2. Send download link via email (for album purchase)
      // 3. Send thank you email (for coffee)
      // 4. Update customer records

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.data.reference,
          amount: data.data.amount / 100, // Convert from kobo to KES
          currency: data.data.currency,
          customer: data.data.customer,
          metadata: data.data.metadata,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment not successful',
          status: data.data.status,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
