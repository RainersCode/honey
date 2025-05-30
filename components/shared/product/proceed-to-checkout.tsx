'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/context/cart-context';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';

interface ProceedToCheckoutProps {
  lang: Locale;
  session: Session | null;
}

const ProceedToCheckout = ({ lang, session }: ProceedToCheckoutProps) => {
  const router = useRouter();
  const { cart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  if (!dict || !cart || cart.items.length === 0) return null;

  const calculateTotalWeight = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.weight || 0) * item.qty;
    }, 0);
  };

  const handleCheckout = () => {
    if (!session) {
      // User is not authenticated, redirect to sign-in with callback URL
      const callbackUrl = encodeURIComponent(`/${lang}/shipping-address`);
      router.push(`/${lang}/sign-in?callbackUrl=${callbackUrl}`);
      return;
    }

    // User is authenticated, proceed to checkout
    router.push(`/${lang}/shipping-address`);
  };

  const totalWeight = calculateTotalWeight();
  const isOverweightLimit = totalWeight > 30;

  return (
    <>
      {isOverweightLimit && (
        <div className='p-4 bg-[#FF7A3D]/10 border border-[#FF7A3D]/20 rounded-xl mb-4 shadow-sm mt-6'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-[#FF7A3D]'
            >
              <path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z' />
              <line x1='12' y1='9' x2='12' y2='13' />
              <line x1='12' y1='17' x2='12.01' y2='17' />
            </svg>
            <p className='text-[#FF7A3D] font-medium'>
              {dict.cart.weightLimit.exceeded}
            </p>
          </div>
        </div>
      )}
      <Button
        className='w-full mt-4 bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
        disabled={isPending || isOverweightLimit}
        onClick={() => startTransition(() => handleCheckout())}
      >
        {isPending ? (
          <LoadingSpinner size='sm' />
        ) : isOverweightLimit ? (
          dict.cart.weightLimit.buttonText
        ) : !session ? (
          <>
            {dict.auth?.signInToContinue || 'Sign In to Continue'}
            <ArrowRight className='ml-2 h-4 w-4' />
          </>
        ) : (
          <>
            {dict.cart.proceedToCheckout}
            <ArrowRight className='ml-2 h-4 w-4' />
          </>
        )}
      </Button>
    </>
  );
};

export default ProceedToCheckout;
