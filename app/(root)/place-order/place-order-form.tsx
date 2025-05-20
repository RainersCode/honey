'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
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
      <Button disabled={pending} className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'>
        {pending ? (
          <LoadingSpinner size="sm" className="mr-2" />
        ) : (
          <Check className='w-4 h-4 mr-2' />
        )}
        Place Order
      </Button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
