import CartTable from './cart-table';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.cart.title,
  };
}

const CartPage = async ({
  params,
}: {
  params: { lang: Locale };
}) => {
  const cart = await getMyCart();
  const lang = params.lang;

  return (
    <CartTable cart={cart} lang={lang} />
  );
};

export default CartPage; 