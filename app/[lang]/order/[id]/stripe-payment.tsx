'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Dictionary } from '@/types';
import { StripeElementsOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = ({ lang, orderId }: { lang: Locale; orderId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !dict) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${lang}/order/${orderId}/stripe-payment-success`,
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message || 'An error occurred');
    } else {
      setMessage(dict.order.stripe.errors.unexpected);
    }

    setIsLoading(false);
  };

  if (!dict) return null;

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type='submit'
        disabled={isLoading || !stripe || !elements}
        className='w-full mt-4'
      >
        {isLoading ? <LoadingSpinner size='sm' /> : dict.order.stripe.submit}
      </Button>
      {message && <div className='text-red-500 mt-2 text-sm'>{message}</div>}
    </form>
  );
};

const StripePayment = ({
  clientSecret,
  lang,
  orderId,
}: {
  clientSecret: string;
  lang: Locale;
  orderId: string;
}) => {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm lang={lang} orderId={orderId} />
    </Elements>
  );
};

export default StripePayment;
