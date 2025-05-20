'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';

const SimpleAddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
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
    <Button 
      className='w-full bg-transparent hover:bg-[#FF7A3D] border-2 border-[#FF7A3D] text-[#FF7A3D] hover:text-white transition-all duration-300 group'
      type='button' 
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className='h-4 w-4 animate-spin' />
      ) : (
        <>
          <ShoppingBag className='h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]' />
          Add To Cart
        </>
      )}
    </Button>
  );
};

export default SimpleAddToCart; 