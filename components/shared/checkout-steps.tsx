import React from 'react';
import { cn } from '@/lib/utils';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';

interface CheckoutStepsProps {
  current?: number;
  lang: Locale;
}

const CheckoutSteps = async ({ current = 0, lang }: CheckoutStepsProps) => {
  const dict = await getDictionary(lang);
  
  const steps = [
    dict.checkout.steps.userLogin,
    dict.checkout.steps.shippingAddress,
    dict.checkout.steps.placeOrder
  ];

  return (
    <div className='flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10'>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={cn(
              'p-2 w-56 rounded-full text-center text-sm',
              index === current ? 'bg-[#FFE4D2] text-[#FF7A3D]' : 'text-[#1D1D1F]'
            )}
          >
            {step}
          </div>
          {step !== dict.checkout.steps.placeOrder && (
            <hr className='w-16 border-t border-[#FFE4D2] mx-2' />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
