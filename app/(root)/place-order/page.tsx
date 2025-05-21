import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { ShippingAddress } from '@/types';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import PlaceOrderForm from './place-order-form';
import { CreditCard, MapPin, Package, Pencil } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Place Order',
};

const PlaceOrderPage = async () => {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as ShippingAddress;

  return (
    <div className="wrapper py-8">
      <CheckoutSteps current={3} />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[#FF7A3D] mb-8">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-serif">Review Your Order</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#FF7A3D]" />
                    <CardTitle className="text-xl font-serif">Shipping Address</CardTitle>
                  </div>
                  <Link href="/shipping-address">
                    <Button variant="outline" size="sm" className="text-[#FF7A3D] border-[#FFE4D2] hover:bg-[#FFF5EE]">
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-[#1D1D1F]">
                  <p className="font-medium">{userAddress.fullName}</p>
                  <p className="text-muted-foreground">
                    {userAddress.streetAddress}, {userAddress.city}{' '}
                    {userAddress.postalCode}, {userAddress.country}
                  </p>
                  <p className="text-muted-foreground">Phone: {userAddress.phoneNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#FF7A3D]" />
                    <CardTitle className="text-xl font-serif">Payment Method</CardTitle>
                  </div>
                  <Link href="/payment-method">
                    <Button variant="outline" size="sm" className="text-[#FF7A3D] border-[#FFE4D2] hover:bg-[#FFF5EE]">
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-[#1D1D1F] font-medium">{user.paymentMethod}</p>
              </CardContent>
            </Card>

            {/* Order Items Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#FF7A3D]" />
                  <CardTitle className="text-xl font-serif">Order Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#FFE4D2]">
                        <TableHead className="text-[#1D1D1F]">Item</TableHead>
                        <TableHead className="text-[#1D1D1F]">Quantity</TableHead>
                        <TableHead className="text-[#1D1D1F] text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.items.map((item) => (
                        <TableRow key={item.slug} className="border-[#FFE4D2]">
                          <TableCell className="py-4">
                            <Link
                              href={`/product/${item.slug}`}
                              className="flex items-center hover:text-[#FF7A3D] transition-colors duration-200"
                            >
                              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="ml-3 font-medium">{item.name}</span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-[#1D1D1F]">
                            {item.qty}
                          </TableCell>
                          <TableCell className="text-right font-medium text-[#1D1D1F]">
                            {formatCurrency(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Card */}
          <div>
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300 sticky top-24">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <CardTitle className="text-xl font-serif text-[#1D1D1F]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-[#1D1D1F]">
                    <span>Items</span>
                    <span className="font-medium">{formatCurrency(cart.itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#1D1D1F]">
                    <span>Tax</span>
                    <span className="font-medium">{formatCurrency(cart.taxPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#1D1D1F]">
                    <span>Shipping</span>
                    <span className="font-medium">{formatCurrency(cart.shippingPrice)}</span>
                  </div>
                  <div className="pt-4 border-t border-[#FFE4D2]">
                    <div className="flex justify-between text-[#1D1D1F]">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-lg font-medium text-[#FF7A3D]">
                        {formatCurrency(cart.totalPrice)}
                      </span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <PlaceOrderForm />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
