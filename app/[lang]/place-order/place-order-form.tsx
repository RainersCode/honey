'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { Cart, User } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { createOrder } from '@/lib/actions/order.actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

interface PlaceOrderFormProps {
  cart: Cart;
  user: User;
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
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md'>
        <CardHeader>
          <CardTitle>{dict.placeOrder.shipping.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>
                {dict.placeOrder.shipping.name}:
              </span>{' '}
              {user.address?.fullName}
            </p>
            <p className='text-sm text-gray-600'>
              <span className='font-medium'>
                {dict.placeOrder.shipping.phone}:
              </span>{' '}
              {user.address?.phoneNumber}
            </p>
            {cart.deliveryMethod === 'international' ? (
              <>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>
                    {dict.placeOrder.shipping.address}:
                  </span>{' '}
                  {user.address?.streetAddress}, {user.address?.city},{' '}
                  {user.address?.postalCode}, {user.address?.country}
                </p>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>
                    {dict.placeOrder.shipping.method}:
                  </span>{' '}
                  International Shipping
                </p>
              </>
            ) : (
              <>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>
                    {dict.placeOrder.shipping.omnivaLocation}:
                  </span>{' '}
                  {user.address?.omnivaLocationDetails?.name},{' '}
                  {user.address?.omnivaLocationDetails?.address}
                </p>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>
                    {dict.placeOrder.shipping.method}:
                  </span>{' '}
                  Omniva Pickup
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md'>
        <CardHeader>
          <CardTitle>{dict.placeOrder.payment.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-600'>
            <span className='font-medium'>
              {dict.placeOrder.payment.method}:
            </span>{' '}
            {user.paymentMethod}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md'>
        <CardHeader>
          <CardTitle>{dict.placeOrder.items.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {cart.items.map((item) => (
              <div key={item.productId} className='flex items-center gap-4'>
                <div className='relative h-20 w-20'>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
                <div className='flex-1'>
                  <p className='font-medium'>{item.name}</p>
                  <p className='text-sm text-gray-600'>
                    {item.qty} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className='font-medium'>
                  {formatCurrency(item.qty * Number(item.price))}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className='bg-white/90 backdrop-blur-[2px] shadow-md'>
        <CardHeader>
          <CardTitle>{dict.placeOrder.summary.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>
                {dict.placeOrder.summary.items}
              </p>
              <p className='font-medium'>
                {formatCurrency(Number(cart.itemsPrice))}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>
                {dict.placeOrder.summary.shipping}
              </p>
              <p className='font-medium'>
                {formatCurrency(Number(cart.shippingPrice))}
              </p>
            </div>
            <div className='flex justify-between'>
              <p className='text-sm text-gray-600'>
                {dict.placeOrder.summary.tax}
              </p>
              <p className='font-medium'>
                {formatCurrency(Number(cart.taxPrice))}
              </p>
            </div>
            <div className='flex justify-between border-t pt-2'>
              <p className='font-medium'>{dict.placeOrder.summary.total}</p>
              <p className='font-medium'>
                {formatCurrency(Number(cart.totalPrice))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={onSubmit}
        className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
        disabled={isPending}
      >
        {isPending ? (
          <LoadingSpinner size='sm' />
        ) : (
          <>
            {dict.placeOrder.submit}
            <ArrowRight className='ml-2 h-4 w-4' />
          </>
        )}
      </Button>
    </div>
  );
};

export default PlaceOrderForm;
