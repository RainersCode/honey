import React from 'react';
import { cn } from '@/lib/utils';
import { Locale } from '@/config/i18n.config';

interface CheckoutStepsProps {
  current?: number;
  lang: Locale;
}

const CheckoutSteps = ({ current = 0, lang }: CheckoutStepsProps) => {
  return (
    <div className='flex-between flex-col md:flex-row space-x-2 space-y-2 mb-10'>
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step, index) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                'p-2 w-56 rounded-full text-center text-sm',
                index === current ? 'bg-[#FFE4D2] text-[#FF7A3D]' : 'text-[#1D1D1F]'
              )}
            >
              {step}
            </div>
            {step !== 'Place Order' && (
              <hr className='w-16 border-t border-[#FFE4D2] mx-2' />
            )}
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default CheckoutSteps;
