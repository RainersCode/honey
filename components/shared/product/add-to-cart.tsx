'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Loader } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useTransition } from 'react';
import { Locale } from '@/config/i18n.config';

const QuantityCartControl = ({ cart, item, lang }: { cart?: Cart; item: CartItem; lang: Locale }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item, lang);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      // Handle success add to cart
      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-colors'
            altText='Go To Cart'
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  // Handle remove from cart
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });

      return;
    });
  };

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

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
          <Loader className='h-4 w-4 animate-spin' />
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
          <Loader className='h-4 w-4 animate-spin' />
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
        <Loader className='h-4 w-4 animate-spin' />
      ) : (
        <>
          Add To Cart
        </>
      )}
    </Button>
  );
};

export default QuantityCartControl;
