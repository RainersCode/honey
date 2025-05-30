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
      console.log('✅ Webhook event constructed successfully:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', {
        error: err.message,
        stack: err.stack,
      });
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;

      console.log('🔍 Charge details:', {
        chargeId: charge.id,
        amount: charge.amount,
        currency: charge.currency,
        metadata: charge.metadata,
        billingDetails: charge.billing_details,
      });

      const orderId = charge.metadata?.orderId;

      if (!orderId) {
        console.error('❌ No orderId in charge metadata:', {
          chargeId: charge.id,
          metadata: charge.metadata,
        });
        return new NextResponse('No orderId found in charge metadata', {
          status: 400,
        });
      }

      try {
        console.log(`🚀 Processing charge.succeeded for orderId: ${orderId}`);

        const updateResult = await updateOrderToPaid({
          orderId,
          paymentResult: {
            id: charge.id,
            status: 'COMPLETED',
            email_address: charge.billing_details?.email || '',
            pricePaid: (charge.amount / 100).toFixed(2),
          },
        });

        console.log('✅ Order updated successfully:', {
          orderId,
          chargeId: charge.id,
          emailAddress: charge.billing_details?.email,
          pricePaid: (charge.amount / 100).toFixed(2),
        });

        return NextResponse.json({
          received: true,
          orderId,
          eventId: event.id,
        });
      } catch (dbError: any) {
        console.error('❌ Database error while updating order:', {
          orderId,
          chargeId: charge.id,
          error: dbError.message,
          stack: dbError.stack,
          details: dbError,
        });
        return new NextResponse(`Database error: ${dbError.message}`, {
          status: 500,
        });
      }
    } else {
      console.log(`ℹ️ Received unhandled event type: ${event.type}`);
    }

    return NextResponse.json({
      received: true,
      type: event.type,
      eventId: event.id,
    });
  } catch (error: any) {
    console.error('❌ Full webhook error:', {
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
