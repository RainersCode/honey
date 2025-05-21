'use client';

import { useRouter } from 'next/navigation';
import { Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { createOrder } from '@/lib/actions/order.actions';
import LoadingSpinner from '@/components/ui/loading-spinner';

const PlaceOrderForm = () => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
  };

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button 
        disabled={pending} 
        className="w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg py-6"
      >
        {pending ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" />
            <span>Processing Order...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span>Place Order</span>
          </div>
        )}
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
