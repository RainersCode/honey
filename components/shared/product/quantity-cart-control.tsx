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
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface QuantityCartControlProps {
  cart?: Cart;
  item: CartItem;
  lang: Locale;
}

const QuantityCartControl = ({
  cart,
  item,
  lang,
}: QuantityCartControlProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { updateCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const calculateTotalWeight = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, cartItem) => {
      return total + (cartItem.weight || 0) * cartItem.qty;
    }, 0);
  };

  const wouldExceedWeightLimit = (quantity: number = 1) => {
    const currentTotalWeight = calculateTotalWeight();
    const existItem = cart?.items.find((x) => x.productId === item.productId);
    const currentItemWeight = existItem
      ? (existItem.weight || 0) * existItem.qty
      : 0;
    const newItemWeight = (item.weight || 0) * quantity;
    return currentTotalWeight - currentItemWeight + newItemWeight > 30;
  };

  const handleAddToCart = async () => {
    if (!dict) return;

    if (wouldExceedWeightLimit()) {
      return;
    }

    startTransition(async () => {
      const res = await addItemToCart(item, lang);

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.message || 'Failed to add item to cart',
        });
        return;
      }

      await updateCart();

      toast({
        title: 'Success',
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

      await updateCart();

      toast({
        title: 'Success',
        description: res.message || 'Item removed from cart',
      });
    });
  };

  const handleQuantityEdit = async (newQty: number) => {
    if (!dict || isPending) return;

    if (newQty < 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Quantity cannot be negative',
      });
      return;
    }

    if (newQty === 0) {
      // Remove all items
      startTransition(async () => {
        const currentQty = existItem?.qty || 0;
        for (let i = 0; i < currentQty; i++) {
          const res = await removeItemFromCart(item.productId);
          if (!res.success) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: res.message || 'Failed to remove item from cart',
            });
            return;
          }
        }
        await updateCart();
        setIsEditing(false);
      });
      return;
    }

    if (wouldExceedWeightLimit(newQty)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Total weight would exceed 30kg limit',
      });
      return;
    }

    const currentQty = existItem?.qty || 0;
    const diff = newQty - currentQty;

    startTransition(async () => {
      let res;
      if (diff > 0) {
        // Need to add items
        for (let i = 0; i < diff; i++) {
          res = await addItemToCart(item, lang);
          if (!res.success) break;
        }
      } else {
        // Need to remove items
        for (let i = 0; i < Math.abs(diff); i++) {
          res = await removeItemFromCart(item.productId);
          if (!res.success) break;
        }
      }

      if (!res?.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res?.message || 'Failed to update quantity',
        });
        return;
      }

      await updateCart();
      setIsEditing(false);
    });
  };

  const handleEditStart = () => {
    if (existItem) {
      setEditValue(existItem.qty.toString());
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  };

  const handleEditComplete = () => {
    const newQty = parseInt(editValue);
    if (!isNaN(newQty) && newQty !== existItem?.qty) {
      handleQuantityEdit(newQty);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);
  if (!dict) return null;

  const isWeightLimitReached = wouldExceedWeightLimit();

  return (
    <div className='space-y-2'>
      {existItem ? (
        <div className='flex items-center justify-center gap-2'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='h-8 w-8 rounded-full border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-all duration-300'
            onClick={handleRemoveFromCart}
            disabled={isPending}
          >
            {isPending ? (
              <LoadingSpinner size='sm' />
            ) : (
              <Minus className='h-4 w-4' />
            )}
          </Button>

          {isEditing ? (
            <Input
              ref={inputRef}
              type='number'
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditComplete}
              onKeyDown={handleKeyDown}
              className='w-16 text-center px-2'
              min='0'
            />
          ) : (
            <div
              className='group relative cursor-pointer'
              onClick={handleEditStart}
            >
              <span className='w-8 text-center font-medium block px-2 py-1 rounded border border-gray-200 hover:border-[#FF7A3D] hover:bg-[#fff0eb] transition-all duration-300'>
                {existItem.qty}
              </span>
              <div className='absolute -top-6 left-50 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none'>
                Click to edit
              </div>
            </div>
          )}

          <Button
            type='button'
            variant='outline'
            size='icon'
            className='h-8 w-8 rounded-full border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-all duration-300'
            onClick={handleAddToCart}
            disabled={isPending || isWeightLimitReached}
          >
            {isPending ? (
              <LoadingSpinner size='sm' />
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
          disabled={isPending || isWeightLimitReached}
        >
          {isPending ? <LoadingSpinner size='sm' /> : dict.common.addToCart}
        </Button>
      )}
    </div>
  );
};

export default QuantityCartControl;
