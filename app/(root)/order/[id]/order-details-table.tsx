'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import {
  createPayPalOrder,
  approvePayPalOrder,
  updateOrderToPaidCOD,
  deliverOrder,
  shipOrder,
} from '@/lib/actions/order.actions';
import StripePayment from './stripe-payment';
import { Package, CreditCard, Truck, MapPin, Pencil } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
    isShipped,
    shippedAt,
  } = order;

  const { toast } = useToast();

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';

    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error Loading PayPal';
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order.id, data);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Paid'}
      </Button>
    );
  };

  // Button to mark order as delivered
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? 'processing...' : 'Mark As Delivered'}
      </Button>
    );
  };

  // Button to mark order as shipped
  const MarkAsShippedButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await shipOrder(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
        className="mb-2"
      >
        {isPending ? 'processing...' : 'Mark As Shipped'}
      </Button>
    );
  };

  return (
    <div className="wrapper py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[#FF7A3D] mb-8">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-serif">Order {formatId(id)}</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF7A3D]" />
                  <CardTitle className="text-xl font-serif">Shipping Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-[#1D1D1F]">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">
                    {shippingAddress.streetAddress}, {shippingAddress.city}{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                  <p className="text-muted-foreground">Phone: {shippingAddress.phoneNumber}</p>
                  {isDelivered ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Delivered at {formatDateTime(deliveredAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      Not delivered
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#FF7A3D]" />
                  <CardTitle className="text-xl font-serif">Payment Method</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <p className="text-[#1D1D1F] font-medium">{paymentMethod}</p>
                  {isPaid ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      Paid at {formatDateTime(paidAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                      Not paid
                    </Badge>
                  )}
                  
                  {!isPaid && paymentMethod === 'PayPal' && (
                    <div className="mt-4">
                      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                        <div className="text-center text-[#1D1D1F] mb-2">
                          <PrintLoadingState />
                        </div>
                        <PayPalButtons
                          createOrder={handleCreatePayPalOrder}
                          onApprove={handleApprovePayPalOrder}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}

                  {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                    <div className="mt-4">
                      <StripePayment 
                        clientSecret={stripeClientSecret}
                        priceInCents={Math.round(totalPrice * 100)}
                        orderId={id}
                      />
                    </div>
                  )}

                  {!isPaid && paymentMethod === 'CashOnDelivery' && isAdmin && (
                    <div className="mt-4">
                      <MarkAsPaidButton />
                    </div>
                  )}
                </div>
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
                      {orderitems.map((item) => (
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
                    <span className="font-medium">{formatCurrency(itemsPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#1D1D1F]">
                    <span>Tax</span>
                    <span className="font-medium">{formatCurrency(taxPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[#1D1D1F]">
                    <span>Shipping</span>
                    <span className="font-medium">{formatCurrency(shippingPrice)}</span>
                  </div>
                  <div className="pt-4 border-t border-[#FFE4D2]">
                    <div className="flex justify-between text-[#1D1D1F]">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-lg font-medium text-[#FF7A3D]">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="space-y-3 pt-4 border-t border-[#FFE4D2]">
                      {!isShipped && isPaid && (
                        <MarkAsShippedButton />
                      )}
                      {isShipped && !isDelivered && (
                        <MarkAsDeliveredButton />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
