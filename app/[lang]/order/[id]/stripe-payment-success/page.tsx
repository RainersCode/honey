'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Locale } from '@/config/i18n.config';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

const SuccessPage = () => {
  const router = useRouter();
  const params = useParams();
  const [dict, setDict] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;
  const lang = params.lang as Locale;

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        if (!lang) {
          throw new Error('Language not found');
        }
        const dictionary = await getDictionary(lang);
        setDict(dictionary);
        setError(null);
      } catch (error) {
        console.error('Error loading dictionary:', error);
        setError('Failed to load page content');
        // Set fallback content
        setDict({
          order: {
            stripe: {
              success: {
                title: 'Payment Successful',
                message:
                  'Your payment has been processed successfully. You will receive an email confirmation shortly.',
                viewOrder: 'View Order Details',
                orderId: 'Order ID',
                emailConfirmation:
                  'An email confirmation has been sent to your registered email address.',
              },
            },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [lang]);

  useEffect(() => {
    if (!orderId || !lang || isLoading) return;

    const timer = setTimeout(() => {
      try {
        router.push(`/${lang}/order/${orderId}`);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [router, orderId, lang, isLoading]);

  const handleViewOrder = () => {
    try {
      router.push(`/${lang}/order/${orderId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window location
      window.location.href = `/${lang}/order/${orderId}`;
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto'></div>
          <p className='mt-4 text-gray-600 text-sm'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
          {/* Success Icon */}
          <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-6'>
            <CheckCircle2 className='h-8 w-8 text-green-600' />
          </div>

          {/* Success Message */}
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-3'>
              {dict?.order?.stripe?.success?.title || 'Payment Successful'}
            </h1>
            <p className='text-gray-600 leading-relaxed'>
              {dict?.order?.stripe?.success?.message ||
                'Your payment has been processed successfully. You will receive an email confirmation shortly.'}
            </p>
            {error && <p className='text-sm text-amber-600 mt-2'>{error}</p>}
          </div>

          {/* Order ID */}
          <div className='bg-gray-50 rounded-md p-4 mb-6'>
            <p className='text-sm text-gray-500 mb-1'>
              {dict?.order?.stripe?.success?.orderId || 'Order ID'}
            </p>
            <p className='font-mono text-gray-900 font-medium'>{orderId}</p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleViewOrder}
            className='w-full bg-gray-900 hover:bg-gray-800 text-white h-11 rounded-md transition-colors duration-200'
          >
            <span>
              {dict?.order?.stripe?.success?.viewOrder || 'View Order Details'}
            </span>
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>

          {/* Auto redirect notice */}
          <p className='text-xs text-gray-500 mt-4'>
            Redirecting automatically in 8 seconds...
          </p>
        </div>

        {/* Additional Info */}
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-500'>
            {dict?.order?.stripe?.success?.emailConfirmation ||
              'An email confirmation has been sent to your registered email address.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
