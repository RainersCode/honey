import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import PlaceOrderForm from './place-order-form';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { ShippingAddress } from '@/types';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return {
    title: dict.placeOrder.meta.title,
    description: dict.placeOrder.meta.description,
  };
}

const PlaceOrderPage = async ({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const { lang } = await params;
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect(`/${lang}/cart`);

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('No user ID');

  const user = await getUserById(userId);
  const dict = await getDictionary(lang) as any;

  if (!user.address) redirect(`/${lang}/shipping-address`);

  // Cast the user address from JsonValue to ShippingAddress
  const typedUser = {
    ...user,
    address: user.address as ShippingAddress | null
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif text-center text-[#1D1D1F] mb-8">
          {dict.placeOrder.title}
        </h1>
        <CheckoutSteps current={2} lang={lang} />
        <div className="mt-8">
          <PlaceOrderForm 
            cart={cart} 
            user={typedUser} 
            lang={lang} 
          />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage; 