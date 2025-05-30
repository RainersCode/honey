import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return new NextResponse('No Stripe signature found', { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log('Webhook event constructed successfully:', event.type);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', {
        error: err.message,
        stack: err.stack,
      });
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId) {
        console.error(
          'No orderId in payment_intent metadata:',
          paymentIntent.id
        );
        return new NextResponse('No orderId found in payment_intent metadata', {
          status: 400,
        });
      }

      try {
        console.log(
          `Processing payment_intent.succeeded for orderId: ${orderId}`
        );
        await updateOrderToPaid({
          orderId,
          paymentResult: {
            id: paymentIntent.id,
            status: 'COMPLETED',
            email_address: paymentIntent.receipt_email || '',
            pricePaid: (paymentIntent.amount / 100).toFixed(2),
          },
        });
        console.log(
          `Order ${orderId} updated successfully for payment_intent ${paymentIntent.id}`
        );
        return NextResponse.json({
          received: true,
          orderId,
          eventId: event.id,
        });
      } catch (dbError: any) {
        console.error('Database error while updating order:', {
          orderId,
          error: dbError.message,
          stack: dbError.stack,
          details: dbError,
        });
        return new NextResponse(`Database error: ${dbError.message}`, {
          status: 500,
        });
      }
    } else {
      console.log(`Received unhandled event type: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
      type: event.type,
      eventId: event.id,
    });
  } catch (error: any) {
    console.error('Full webhook error:', {
      message: error.message,
      stack: error.stack,
      details: error,
    });
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false, // Crucial for raw body access
  },
};
