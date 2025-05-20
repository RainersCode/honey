'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Cart } from '@/types';
import { getMyCart } from '../actions/cart.actions';

interface CartContextType {
  cart: Cart | undefined;
  updateCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  const updateCart = async () => {
    try {
      const updatedCart = await getMyCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  useEffect(() => {
    updateCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 