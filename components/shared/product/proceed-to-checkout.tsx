'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/context/cart-context';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import { useEffect, useState } from 'react';

interface ProceedToCheckoutProps {
  lang: Locale;
}

const ProceedToCheckout = ({ lang }: ProceedToCheckoutProps) => {
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

  return (
    <Button
      className='w-full mt-4 bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
      disabled={isPending}
      onClick={() =>
        startTransition(() => router.push(`/${lang}/shipping-address`))
      }
    >
      {isPending ? (
        <LoadingSpinner size='sm' />
      ) : (
        <>
          {dict.cart.summary.checkout}
          <ArrowRight className='ml-2 h-4 w-4' />
        </>
      )}
    </Button>
  );
};

export default ProceedToCheckout;
