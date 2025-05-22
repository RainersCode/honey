'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Locale } from '@/config/i18n.config';
import { CheckCircle } from 'lucide-react';

const SuccessPage = ({
  params: { id, lang }
}: {
  params: {
    id: string;
    lang: Locale;
  };
}) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/${lang}/order/${id}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, id, lang]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <Button
            onClick={() => router.push(`/${lang}/order/${id}`)}
            className="w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300"
          >
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
