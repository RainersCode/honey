'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';
import { useCart } from '@/lib/context/cart-context';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { useEffect, useState } from 'react';

interface SimpleAddToCartProps {
  item: CartItem;
  lang: Locale;
}

const SimpleAddToCart = ({ item, lang }: SimpleAddToCartProps) => {
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
      const res = await addItemToCart(item, lang);

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'error',
          description: res.message || 'Failed to add item to cart',
        });
        return;
      }

      // Update cart context
      await updateCart();

      toast({
        title: 'success',
        description: res.message || 'Item added to cart',
        action: (
          <ToastAction
            altText='Go to cart'
            onClick={() => router.push(`/${lang}/cart`)}
          >
            {dict.common.cart}
          </ToastAction>
        ),
      });
    });
  };

  if (!dict) return null;

  return (
    <div className='flex items-center gap-2'>
      <Button
        className='flex-1 bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FF7A3D]/20 active:scale-[0.98] transition-all duration-300 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 overflow-hidden'
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? <LoadingSpinner size='sm' /> : dict.common.addToCart}
      </Button>
      <Button
        variant='outline'
        size='icon'
        className='border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-[#FF7A3D]/20 active:scale-[0.98] transition-all duration-300'
        onClick={() => router.push(`/${lang}/product/${item.slug}`)}
      >
        <Eye className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default SimpleAddToCart;
