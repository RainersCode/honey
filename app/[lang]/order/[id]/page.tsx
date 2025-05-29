import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';
import Stripe from 'stripe';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return {
    title: dict.order.meta.title,
    description: dict.order.meta.description,
  };
}

const OrderDetailsPage = async ({
  params
}: {
  params: Promise<{
    id: string;
    lang: Locale;
  }>;
}) => {
  const { id, lang } = await params;
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session) {
    return redirect(`/${lang}/login?callbackUrl=/${lang}/order/${id}`);
  }

  const order = await getOrderById(id);
  if (!order) notFound();

  const dict = await getDictionary(lang) as any;

  // Redirect the user if they don't own the order
  if (order.userId !== session.user.id && session.user.role !== 'admin') {
    return redirect(`/${lang}/unauthorized`);
  }

  let client_secret = null;

  // Check if is not paid and using stripe
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    });
    client_secret = paymentIntent.client_secret;
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      stripeClientSecret={client_secret}
      isAdmin={session?.user?.role === 'admin' || false}
      lang={lang}
      dict={dict}
    />
  );
};

export default OrderDetailsPage;
