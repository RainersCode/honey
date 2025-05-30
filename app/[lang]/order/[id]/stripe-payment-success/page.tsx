'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Locale } from '@/config/i18n.config';
import { CheckCircle } from 'lucide-react';
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
                title: 'Payment Successful!',
                message: 'Your payment has been processed successfully.',
                viewOrder: 'View Order',
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
    }, 5000);

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
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7A3D] mx-auto'></div>
          <p className='mt-2 text-[#1D1D1F]'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#FFFBF8]'>
      <div className='text-center space-y-6 p-8 max-w-md mx-auto'>
        <div className='flex justify-center'>
          <CheckCircle className='h-16 w-16 text-green-500' />
        </div>

        <div className='space-y-2'>
          <h1 className='text-2xl font-bold text-[#1D1D1F]'>
            {dict?.order?.stripe?.success?.title || 'Payment Successful!'}
          </h1>
          <p className='text-[#1D1D1F]/70'>
            {dict?.order?.stripe?.success?.message ||
              'Your payment has been processed successfully.'}
          </p>
          {error && <p className='text-sm text-orange-600'>{error}</p>}
        </div>

        <div className='space-y-3'>
          <Button
            onClick={handleViewOrder}
            className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white'
          >
            {dict?.order?.stripe?.success?.viewOrder || 'View Order'}
          </Button>

          <p className='text-sm text-[#1D1D1F]/50'>
            Redirecting automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
