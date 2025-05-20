'use client';

import { useEffect, useState } from 'react';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Cart } from '@/types';

const CartCount = () => {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cart = await getMyCart() as Cart | undefined;
        const count = cart?.items.reduce((sum, item) => sum + item.qty, 0) || 0;
        setItemCount(count);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    updateCartCount();

    // Update cart count when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCartCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (itemCount === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-[#FF7A3D] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
      {itemCount}
    </div>
  );
};

export default CartCount; 