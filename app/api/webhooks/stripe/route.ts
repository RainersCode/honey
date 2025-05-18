import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Ensure this matches your Stripe account's default or the version used for payment intent creation
  typescript: true, // Recommended for type safety
});

async function streamToBuffer(readableStream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = readableStream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        chunks.push(value);
      }
    }
    return Buffer.concat(chunks);
  } finally {
    reader.releaseLock();
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!req.body) {
      console.error('Request body is null');
      return new NextResponse('Request body is missing', { status: 400 });
    }

    const rawBodyBuffer = await streamToBuffer(req.body);
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      console.error('Stripe signature is missing from headers');
      return new NextResponse('Stripe signature is missing', { status: 400 });
    }
    if (!webhookSecret) {
      console.error('Stripe webhook secret is not configured in environment variables.');
      return new NextResponse('Server configuration error: Missing webhook secret', { status: 500 });
    }
    
    console.log(`Received webhook. Signature: ${signature.slice(0,10)}... Buffer length: ${rawBodyBuffer.length}`);


    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBodyBuffer,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error(`⚠️  Webhook signature verification failed: ${err.message}`);
      console.error(`Raw error object:`, err); // Log the full error object
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    
    console.log(`✅ Success: Verified webhook event: ${event.id}, Type: ${event.type}`);

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      const orderId = charge.metadata?.orderId;

      if (!orderId) {
        console.error('No orderId in charge metadata');
        return new NextResponse('No orderId found in charge metadata', { status: 400 });
      }

      try {
        console.log(`Processing charge.succeeded for orderId: ${orderId}`);
        await updateOrderToPaid({
          orderId,
          paymentResult: {
            id: charge.id,
            status: 'COMPLETED',
            email_address: charge.billing_details?.email || '',
            pricePaid: (charge.amount / 100).toFixed(2),
          },
        });
        console.log(`Order ${orderId} updated successfully for charge ${charge.id}`);
        return NextResponse.json({ received: true, orderId, eventId: event.id });
      } catch (dbError: any) {
        console.error(`Error updating order ${orderId} in database: ${dbError.message}`);
        return new NextResponse(`Database error: ${dbError.message}`, { status: 500 });
      }
    } else {
      console.log(`Received unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, type: event.type, eventId: event.id });

  } catch (error: any) {
    console.error(`Unhandled error in webhook processing: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Crucial for raw body access
  },
};