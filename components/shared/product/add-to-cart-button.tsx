'use client';

import { useEffect, useState } from 'react';
import { CartItem } from '@/types';
import QuantityCartControl from './quantity-cart-control';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Locale } from '@/config/i18n.config';

interface AddToCartButtonProps {
  item: CartItem;
  lang: Locale;
}

const AddToCartButton = ({ item, lang }: AddToCartButtonProps) => {
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getMyCart();
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  return <QuantityCartControl cart={cart} item={item} lang={lang} />;
};

export default AddToCartButton; 