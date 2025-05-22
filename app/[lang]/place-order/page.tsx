import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import PlaceOrderForm from './place-order-form';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);

  return {
    title: dict.placeOrder.meta.title,
    description: dict.placeOrder.meta.description,
  };
}

const PlaceOrderPage = async ({
  params: { lang }
}: {
  params: { lang: Locale };
}) => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect(`/${lang}/cart`);

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('No user ID');

  const user = await getUserById(userId);
  const dict = await getDictionary(lang);

  if (!user.address) redirect(`/${lang}/shipping-address`);
  if (!user.paymentMethod) redirect(`/${lang}/payment-method`);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif text-center text-[#1D1D1F] mb-8">
          {dict.placeOrder.title}
        </h1>
        <CheckoutSteps current={3} lang={lang} />
        <div className="mt-8">
          <PlaceOrderForm 
            cart={cart} 
            user={user} 
            lang={lang} 
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage; 