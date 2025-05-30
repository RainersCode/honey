import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { auth } from '@/auth';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.lang) {
      // Fallback metadata if params is not available during static generation
      return {
        title: 'Cart | Honey Farm',
      };
    }

    const { lang } = resolvedParams;
    const dict = await getDictionary(lang);

    return {
      title: dict.cart.title,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Cart | Honey Farm',
    };
  }
}

const CartPage = async ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const resolvedParams = await params;

  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <h1 className='text-4xl font-serif text-[#1D1D1F] mb-4'>
            Shopping Cart
          </h1>
          <p className='text-gray-600'>Your cart is currently empty.</p>
        </div>
      </div>
    );
  }

  const { lang } = resolvedParams;
  const cart = await getMyCart();
  const session = await auth();

  return <CartTable cart={cart || null} lang={lang} session={session} />;
};

export default CartPage;
