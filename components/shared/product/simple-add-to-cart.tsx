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

const SimpleAddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { updateCart } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      // Update cart context
      await updateCart();

      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-colors'
            altText='Go To Cart'
            onClick={() => router.push('/cart')}
          >
            View Cart
          </ToastAction>
        ),
      });
    });
  };

  return (
    <div className="relative w-full group">
      <div className="absolute inset-0 bg-[#FF7A3D]/20 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300"></div>
      <Button 
        className='w-full bg-white hover:bg-gradient-to-r hover:from-[#FF7A3D] hover:to-[#ff6a2a] border-2 border-[#FF7A3D] text-[#FF7A3D] hover:text-white hover:border-transparent hover:scale-105 hover:shadow-[0_0_15px_rgba(255,122,61,0.5)] active:scale-95 transition-all duration-300 ease-out relative z-10'
        type='button' 
        onClick={() => router.push(`/product/${item.slug}`)}
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size="sm" className="text-[#FF7A3D]" />
        ) : (
          <>
            <Eye className='h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]' />
            View Product
          </>
        )}
      </Button>
    </div>
  );
};

export default SimpleAddToCart; 