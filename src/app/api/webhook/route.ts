import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error('Paystack secret key not configured');
      return NextResponse.json(
        { error: 'Webhook handler unavailable' },
        { status: 500 }
      );
    }

    // Get the signature from the headers
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    // Get the raw body
    const body = await request.text();

    // Validate the signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Parse the event
    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        // Payment was successful
        const transaction = event.data;
        console.log('Payment successful:', transaction.reference);
        
        // Here you would typically:
        // 1. Update database with transaction details
        // 2. Send download link for album purchase
        // 3. Send thank you email for coffee
        // 4. Mark order as completed
        
        // Example data available:
        // - transaction.reference
        // - transaction.amount (in kobo)
        // - transaction.customer.email
        // - transaction.metadata (custom fields)
        
        break;

      case 'charge.failed':
        // Payment failed
        console.log('Payment failed:', event.data.reference);
        // Handle failed payment (send notification, update records, etc.)
        break;

      default:
        console.log('Unhandled event type:', event.event);
    }

    // Always return 200 OK to Paystack
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to avoid Paystack retrying
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
