'use client';

import { useCart } from '@/lib/context/cart-context';

const CartCount = () => {
  const { cart } = useCart();
  
  const itemCount = cart?.items.reduce((sum, item) => sum + item.qty, 0) || 0;

  if (itemCount === 0) return null;

  return (
    <div className="absolute -top-2 -right-2 bg-[#FF7A3D] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
      {itemCount}
    </div>
  );
};

export default CartCount; 