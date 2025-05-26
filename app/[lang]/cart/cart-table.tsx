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

interface CartTableProps {
  cart: Cart;
  lang: Locale;
}

const CartTable = ({ cart, lang }: CartTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<Record<string, any>>(null);
  const [selectedShipping, setSelectedShipping] = useState<{ service: string; rate: number } | null>(null);
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

  const handleShippingSelect = async (rate: { service: string; rate: number }) => {
    setSelectedShipping(rate);
    const method = rate.service.toLowerCase().includes('omniva') ? 'omniva' : 'home';
    
    startTransition(async () => {
      const result = await updateCartDeliveryMethod(method);
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to update shipping method'
        });
      }
    });
  };

  // Calculate prices
  const subtotal = cart?.items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price.toString());
    const itemQty = parseInt(item.qty.toString());
    return sum + (itemPrice * itemQty);
  }, 0) || 0;

  const shippingCost = selectedShipping?.rate 
    ? parseFloat(selectedShipping.rate.toString()) 
    : cart?.shippingPrice 
      ? parseFloat(cart.shippingPrice.toString()) 
      : 0;

  // Ensure we're working with numbers and round to 2 decimal places
  const total = Number((subtotal + shippingCost).toFixed(2));
  const totalWeight = calculateTotalWeight();
  const isOverweightLimit = totalWeight > 30;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif text-[#1D1D1F] mb-2">{dict.cart.title}</h1>
        <div className="w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full"></div>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="flex flex-col items-center gap-4">
            <ShoppingBag className="w-16 h-16 text-[#FF7A3D]/30" />
            <h2 className="text-xl font-serif text-[#1D1D1F]">{dict.cart.empty.title}</h2>
            <p className="text-[#1D1D1F]/70 mb-4">{dict.cart.empty.description}</p>
            <Link href={`/${lang}/search`}>
              <Button 
                className="bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white transition-colors duration-300"
              >
                {dict.cart.empty.action}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="flex items-center gap-4">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-sm font-medium text-[#FF7A3D] mt-1">
                          {formatCurrency(item.price)} per item
                        </p>
                        {item.weight > 0 && (
                          <p className="text-sm text-gray-500">
                            {dict.common.weight}: {item.weight}kg ({item.weight * item.qty}kg {dict.cart.total})
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <QuantityCartControl cart={cart} item={item} lang={lang} />
                        <p className="text-sm text-gray-500 text-center">
                          {item.qty} {item.qty === 1 ? dict.cart.item : dict.cart.items}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="font-medium">{formatCurrency(item.price * item.qty)}</p>
                        <p className="text-sm text-gray-500">{dict.cart.total}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-6">
            <ShippingCalculator
              cartWeight={calculateTotalWeight()}
              onRateSelect={handleShippingSelect}
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">{dict.cart.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-base">
                  <div>
                    <span className="text-gray-600 font-medium text-lg">{dict.cart.subtotal}</span>
                    <p className="text-base text-gray-500">Products total</p>
                  </div>
                  <span className="font-semibold text-[#1D1D1F] text-lg">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <div>
                    <span className="text-gray-600 font-medium text-lg">{dict.common.weight}</span>
                    <p className="text-base text-gray-500">Total weight</p>
                  </div>
                  <span className={`font-semibold text-lg ${isOverweightLimit ? 'text-red-600' : 'text-[#1D1D1F]'}`}>
                    {totalWeight}kg {isOverweightLimit && '⚠️'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <div>
                    <span className="text-gray-600 font-medium text-lg">{dict.cart.shipping}</span>
                    <p className="text-base text-gray-500">Delivery fee</p>
                  </div>
                  <span className="font-semibold text-[#1D1D1F] text-lg">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="h-px bg-gray-200" />
                {isOverweightLimit && (
                  <div className="p-4 bg-[#FF7A3D]/10 border border-[#FF7A3D]/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-[#FF7A3D]"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <p className="text-[#FF7A3D] font-medium">
                        {dict.cart.weightLimit.exceeded}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-[#1D1D1F] text-xl">{dict.cart.total}</span>
                    <p className="text-base text-gray-500">Final price</p>
                  </div>
                  <span className="font-bold text-[#FF7A3D] text-xl">{formatCurrency(total)}</span>
                </div>
                <Button
                  className="w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white mt-4"
                  onClick={() => router.push(`/${lang}/shipping-address`)}
                  disabled={isPending || !selectedShipping || isOverweightLimit}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {dict.cart.processing}
                    </>
                  ) : isOverweightLimit ? (
                    dict.cart.weightLimit.buttonText
                  ) : (
                    <>
                      {dict.cart.proceedToCheckout}
                      <ArrowRight className="ml-2 h-4 w-4" />
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