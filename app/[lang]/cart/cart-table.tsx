'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
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
import LoadingSpinner from '@/components/ui/loading-spinner';

interface CartTableProps {
  cart?: Cart;
  lang: Locale;
}

const CartTable = ({ cart, lang }: CartTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };

    loadDictionary();
  }, [lang]);

  if (!dict) return null;

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
        <div className='grid md:grid-cols-4 md:gap-6'>
          <div className='overflow-x-auto md:col-span-3'>
            <Card className="border-[#FF7A3D]/10">
              <CardHeader className="pb-3">
                <CardTitle className="font-serif text-xl text-[#1D1D1F]">{dict.cart.items}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]/70">{dict.cart.item}</TableHead>
                      <TableHead className="text-center text-[#1D1D1F]/70">{dict.cart.quantity}</TableHead>
                      <TableHead className="text-right text-[#1D1D1F]/70">{dict.cart.price}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map((item) => (
                      <TableRow key={item.slug} className="hover:bg-[#FF7A3D]/5 transition-colors duration-300">
                        <TableCell>
                          <Link
                            href={`/${lang}/product/${item.slug}`}
                            className='flex items-center group'
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <span className='px-3 font-medium text-[#1D1D1F] group-hover:text-[#FF7A3D] transition-colors duration-300'>{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <QuantityCartControl cart={cart} item={item} lang={lang} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-[#1D1D1F]">
                          {formatCurrency(item.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[#FF7A3D]/10 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl text-[#1D1D1F]">{dict.cart.summary.title}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className="flex justify-between items-center text-[#1D1D1F]">
                <span className="text-[#1D1D1F]/70">
                  {dict.cart.summary.items} ({cart.items.reduce((a, c) => a + c.qty, 0)})
                </span>
                <span className="font-medium">{formatCurrency(cart.itemsPrice)}</span>
              </div>
              <Button
                className="w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white transition-colors duration-300"
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push(`/${lang}/shipping-address`))
                }
              >
                {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <ArrowRight className='w-4 h-4 mr-2' />
                )}
                {dict.cart.summary.checkout}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CartTable; 