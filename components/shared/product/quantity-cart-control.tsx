'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';
import { useCart } from '@/lib/context/cart-context';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { useEffect, useState } from 'react';

interface QuantityCartControlProps {
  cart?: Cart;
  item: CartItem;
  lang: Locale;
}

const QuantityCartControl = ({ cart, item, lang }: QuantityCartControlProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { updateCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const handleAddToCart = async () => {
    if (!dict) return;
    
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.message || 'Failed to add item to cart',
        });
        return;
      }

      // Update cart context
      await updateCart();

      // Handle success add to cart
      toast({
        title: 'Success',
        description: res.message || 'Item added to cart',
        action: (
          <ToastAction
            altText="Go to cart"
            onClick={() => router.push(`/${lang}/cart`)}
          >
            {dict.common.cart}
          </ToastAction>
        ),
      });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    if (!dict) return;

    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.message || 'Failed to remove item from cart',
        });
        return;
      }

      // Update cart context
      await updateCart();

      toast({
        title: 'Success',
        description: res.message || 'Item removed from cart',
      });
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  if (!dict) return null;

  return existItem ? (
    <div className="flex items-center justify-center gap-2">
      <Button 
        type='button' 
        variant='outline'
        size="icon"
        className='h-8 w-8 rounded-full border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-all duration-300'
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='w-8 text-center font-medium'>{existItem.qty}</span>
      <Button 
        type='button'
        variant='outline'
        size="icon"
        className='h-8 w-8 rounded-full border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-all duration-300'
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size="sm" />
        ) : (
          <Plus className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button 
      className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300 group'
      type='button' 
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <LoadingSpinner size="sm" />
      ) : (
        dict.common.addToCart
      )}
    </Button>
  );
};

export default QuantityCartControl; 