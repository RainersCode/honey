import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.cart.title,
  };
}

const CartPage = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const { lang } = await params;
  const cart = await getMyCart();

  return (
    <CartTable cart={cart || null} lang={lang} />
  );
};

export default CartPage; 