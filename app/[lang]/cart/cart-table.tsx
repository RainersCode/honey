'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Cart } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import QuantityCartControl from '@/components/shared/product/quantity-cart-control';
import { Locale } from '@/config/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import ShippingCalculator from '@/components/cart/shipping-calculator';
import { updateCartDeliveryMethod } from '@/lib/actions/cart.actions';
import { Session } from 'next-auth';

interface CartTableProps {
  cart: Cart | null;
  lang: Locale;
  session: Session | null;
}

const CartTable = ({ cart, lang, session }: CartTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<Record<string, any> | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<{
    service: string;
    rate: number;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  if (!dict) return null;

  const calculateTotalWeight = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.weight || 0) * item.qty;
    }, 0);
  };

  const handleShippingSelect = async (
    rate: {
      service: string;
      rate: number;
    } | null
  ) => {
    if (!rate) return; // Handle null case

    setSelectedShipping(rate);
    const method = rate.service.toLowerCase().includes('omniva')
      ? 'omniva'
      : 'international';

    startTransition(async () => {
      const result = await updateCartDeliveryMethod(method);
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update shipping method',
        });
        return;
      }

      // Update the shipping cost with the new rate
      if (result.prices?.shippingPrice) {
        setSelectedShipping({
          ...rate,
          rate: result.prices.shippingPrice,
        });
      }

      // Force a server refresh to get updated cart data
      router.refresh();
    });
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

  // Calculate prices
  const subtotal = Number(cart?.itemsPrice || 0);
  const shippingCost = Number(cart?.shippingPrice || 0);
  const tax = Number(cart?.taxPrice || 0);
  const total = Number(cart?.totalPrice || 0);
  const totalWeight = calculateTotalWeight();
  const isOverweightLimit = totalWeight > 30;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='text-center mb-10'>
        <h1 className='text-3xl font-serif text-[#1D1D1F] mb-2'>
          {dict.cart.title}
        </h1>
        <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card className='max-w-md mx-auto text-center p-8'>
          <div className='flex flex-col items-center gap-4'>
            <ShoppingBag className='w-16 h-16 text-[#FF7A3D]/30' />
            <h2 className='text-xl font-serif text-[#1D1D1F]'>
              {dict.cart.empty.title}
            </h2>
            <p className='text-[#1D1D1F]/70 mb-4'>
              {dict.cart.empty.description}
            </p>
            <Link href={`/${lang}/search`}>
              <Button className='bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white transition-colors duration-300'>
                {dict.cart.empty.action}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            {/* Mobile Card Layout */}
            <div className='block md:hidden space-y-4'>
              {cart.items.map((item) => (
                <Card key={item.productId} className='p-4'>
                  <div className='flex gap-3'>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className='rounded-lg flex-shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-medium text-sm leading-tight mb-1'>
                        {item.name}
                      </h3>
                      <p className='text-xs text-gray-500 mb-2 line-clamp-2'>
                        {item.description}
                      </p>
                      <div className='flex items-center justify-between mb-3'>
                        <p className='text-sm font-medium text-[#FF7A3D]'>
                          {formatCurrency(item.price)}
                        </p>
                        <p className='text-sm font-semibold text-[#1D1D1F]'>
                          {formatCurrency(item.price * item.qty)}
                        </p>
                      </div>
                      {item.weight > 0 && (
                        <p className='hidden text-xs text-gray-500 mb-2'>
                          {dict.common.weight}: {item.weight}kg (
                          {item.weight * item.qty}kg {dict.cart.total})
                        </p>
                      )}
                      <div className='flex items-center justify-between'>
                        <QuantityCartControl
                          cart={cart}
                          item={item}
                          lang={lang}
                        />
                        <span className='text-xs text-gray-500'>
                          {item.qty}{' '}
                          {item.qty === 1 ? dict.cart.item : dict.cart.items}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className='hidden md:block'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className='flex items-center gap-4'>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className='rounded-lg'
                          />
                        )}
                        <div>
                          <h3 className='font-medium'>{item.name}</h3>
                          <p className='text-sm text-gray-500'>
                            {item.description}
                          </p>
                          <p className='text-sm font-medium text-[#FF7A3D] mt-1'>
                            {formatCurrency(item.price)} per item
                          </p>
                          {item.weight > 0 && (
                            <p className='hidden text-sm text-gray-500'>
                              {dict.common.weight}: {item.weight}kg (
                              {item.weight * item.qty}kg {dict.cart.total})
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-2'>
                          <QuantityCartControl
                            cart={cart}
                            item={item}
                            lang={lang}
                          />
                          <p className='text-sm text-gray-500 text-center'>
                            {item.qty}{' '}
                            {item.qty === 1 ? dict.cart.item : dict.cart.items}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='space-y-1'>
                          <p className='font-medium'>
                            {formatCurrency(item.price * item.qty)}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {dict.cart.total}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className='space-y-6'>
            <ShippingCalculator
              cartWeight={calculateTotalWeight()}
              onRateSelect={handleShippingSelect}
              lang={lang}
            />

            <Card>
              <CardHeader>
                <CardTitle className='text-xl font-serif'>
                  {dict.cart.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center text-base'>
                  <div>
                    <span className='text-gray-600 font-medium text-lg'>
                      {dict.cart.subtotal}
                    </span>
                    <p className='text-base text-gray-500'>Products total</p>
                  </div>
                  <span className='font-semibold text-[#1D1D1F] text-lg'>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className='flex justify-between items-center text-base'>
                  <div>
                    <span className='text-gray-600 font-medium text-lg'>
                      {dict.cart.shipping}
                    </span>
                    <p className='text-base text-gray-500'>Delivery fee</p>
                  </div>
                  <span className='font-semibold text-[#1D1D1F] text-lg'>
                    {formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className='flex justify-between items-center text-base'>
                  <div>
                    <span className='text-gray-600 font-medium text-lg'>
                      {dict.cart.tax}
                    </span>
                    <p className='text-base text-gray-500'>VAT (21%)</p>
                  </div>
                  <span className='font-semibold text-[#1D1D1F] text-lg'>
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className='h-px bg-gray-200' />
                <div className='flex justify-between items-center'>
                  <div>
                    <span className='font-semibold text-[#1D1D1F] text-xl'>
                      {dict.cart.total}
                    </span>
                    <p className='text-base text-gray-500'>Final price</p>
                  </div>
                  <span className='font-bold text-[#FF7A3D] text-xl'>
                    {formatCurrency(total)}
                  </span>
                </div>
                <Button
                  className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white mt-4'
                  onClick={handleCheckout}
                  disabled={isPending || !selectedShipping || isOverweightLimit}
                >
                  {isPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {dict.cart.processing}
                    </>
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
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTable;
