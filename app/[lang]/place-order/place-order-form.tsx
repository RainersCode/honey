'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { Cart, ShippingAddress } from '@/types';
import { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { createOrder } from '@/lib/actions/order.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

// Extend the Prisma User type to include properly typed address
interface UserWithAddress extends User {
  address: ShippingAddress | null;
}

interface PlaceOrderFormProps {
  cart: Cart;
  user: UserWithAddress;
  lang: Locale;
}

const PlaceOrderForm = ({ cart, user, lang }: PlaceOrderFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  const [isPending, startTransition] = useTransition();

  const onSubmit = async () => {
    startTransition(async () => {
      const res = await createOrder({
        userId: user.id,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        paymentMethod: user.paymentMethod!,
        shippingAddress: user.address!,
      });

      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'error',
          description: res.message,
        });
        return;
      }

      // Extract orderId from redirectTo URL
      const orderId = res.redirectTo.split('/').pop();
      if (!orderId) {
        toast({
          variant: 'destructive',
          title: 'error',
          description: 'Error getting order ID',
        });
        return;
      }

      router.push(`/${lang}/order/${orderId}`);
    });
  };

  if (!dict) return null;

  return (
    <div className='space-y-6'>
      {/* Shipping Address */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md border-[#FFE4D2]'>
        <CardHeader className='border-b border-[#FFE4D2]/50'>
          <CardTitle className='text-[#1D1D1F] font-serif text-lg'>{dict.placeOrder.shipping.title}</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            <p className='text-sm text-[#1D1D1F]'>
              <span className='font-medium text-[#FF7A3D]'>
                {dict.placeOrder.shipping.name}:
              </span>{' '}
              <span className='text-[#1D1D1F]'>{user.address?.fullName}</span>
            </p>
            <p className='text-sm text-[#1D1D1F]'>
              <span className='font-medium text-[#FF7A3D]'>
                {dict.placeOrder.shipping.phone}:
              </span>{' '}
              <span className='text-[#1D1D1F]'>{user.address?.phoneNumber}</span>
            </p>
            {cart.deliveryMethod === 'international' ? (
              <>
                <p className='text-sm text-[#1D1D1F]'>
                  <span className='font-medium text-[#FF7A3D]'>
                    {dict.placeOrder.shipping.address}:
                  </span>{' '}
                  <span className='text-[#1D1D1F]'>
                    {user.address?.streetAddress}, {user.address?.city},{' '}
                    {user.address?.postalCode}, {user.address?.country}
                  </span>
                </p>
                <p className='text-sm text-[#1D1D1F]'>
                  <span className='font-medium text-[#FF7A3D]'>
                    {dict.placeOrder.shipping.method}:
                  </span>{' '}
                  <span className='text-[#1D1D1F]'>International Shipping</span>
                </p>
              </>
            ) : (
              <>
                <p className='text-sm text-[#1D1D1F]'>
                  <span className='font-medium text-[#FF7A3D]'>
                    {dict.placeOrder.shipping.omnivaLocation}:
                  </span>{' '}
                  <span className='text-[#1D1D1F]'>
                    {user.address?.omnivaLocationDetails?.name},{' '}
                    {user.address?.omnivaLocationDetails?.address}
                  </span>
                </p>
                <p className='text-sm text-[#1D1D1F]'>
                  <span className='font-medium text-[#FF7A3D]'>
                    {dict.placeOrder.shipping.method}:
                  </span>{' '}
                  <span className='text-[#1D1D1F]'>Omniva Pickup</span>
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md border-[#FFE4D2]'>
        <CardHeader className='border-b border-[#FFE4D2]/50'>
          <CardTitle className='text-[#1D1D1F] font-serif text-lg'>{dict.placeOrder.payment.title}</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <p className='text-sm text-[#1D1D1F]'>
            <span className='font-medium text-[#FF7A3D]'>
              {dict.placeOrder.payment.method}:
            </span>{' '}
            <span className='text-[#1D1D1F]'>{user.paymentMethod}</span>
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md border-[#FFE4D2]'>
        <CardHeader className='border-b border-[#FFE4D2]/50'>
          <CardTitle className='text-[#1D1D1F] font-serif text-lg'>{dict.placeOrder.items.title}</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            {cart.items.map((item) => (
              <div key={item.productId} className='flex items-center gap-4 p-3 rounded-lg bg-[#FFFBF8] border border-[#FFE4D2]/30'>
                <div className='relative h-20 w-20 flex-shrink-0'>
                  <Image
                    src={item.image || '/placeholder-product.png'}
                    alt={item.name}
                    fill
                    className='object-cover rounded-md border border-[#FFE4D2]'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-[#1D1D1F] truncate'>{item.name}</p>
                  <p className='text-sm text-[#FF7A3D]'>
                    {item.qty} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className='font-semibold text-[#1D1D1F] text-lg'>
                  {formatCurrency(item.qty * Number(item.price))}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md border-[#FFE4D2]'>
        <CardHeader className='border-b border-[#FFE4D2]/50'>
          <CardTitle className='text-[#1D1D1F] font-serif text-lg'>{dict.placeOrder.summary.title}</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <p className='text-sm text-[#1D1D1F]'>
                {dict.placeOrder.summary.items}
              </p>
              <p className='font-medium text-[#1D1D1F]'>
                {formatCurrency(Number(cart.itemsPrice))}
              </p>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-sm text-[#1D1D1F]'>
                {dict.placeOrder.summary.shipping}
              </p>
              <p className='font-medium text-[#1D1D1F]'>
                {formatCurrency(Number(cart.shippingPrice))}
              </p>
            </div>
            <div className='flex justify-between items-center'>
              <p className='text-sm text-[#1D1D1F]'>
                {dict.placeOrder.summary.tax}
              </p>
              <p className='font-medium text-[#1D1D1F]'>
                {formatCurrency(Number(cart.taxPrice))}
              </p>
            </div>
            <div className='flex justify-between items-center border-t border-[#FFE4D2] pt-3 mt-3'>
              <p className='font-semibold text-lg text-[#1D1D1F]'>{dict.placeOrder.summary.total}</p>
              <p className='font-bold text-xl text-[#FF7A3D]'>
                {formatCurrency(Number(cart.totalPrice))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onSubmit}
        className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300 py-4 text-lg font-medium shadow-lg hover:shadow-xl'
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size='sm' />
        ) : (
          <>
            {dict.placeOrder.submit}
            <ArrowRight className='ml-2 h-5 w-5' />
          </>
        )}
      </Button>
    </div>
  );
};

export default PlaceOrderForm;
