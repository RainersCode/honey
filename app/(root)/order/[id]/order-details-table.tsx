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
import { Package, CreditCard, Truck, MapPin } from 'lucide-react';
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
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center gap-2 mb-6'>
        <Package className='h-6 w-6 text-[#FF7A3D]' />
        <h1 className='text-2xl font-serif text-[#1D1D1F]'>Order {formatId(id)}</h1>
      </div>
      
      <div className='grid md:grid-cols-3 md:gap-6'>
        <div className='col-span-2 space-y-6'>
          <Card className='bg-[#FFFBF8] border-[#FFE4D2]'>
            <CardHeader className='border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8] pb-4'>
              <div className='flex items-center gap-2'>
                <CreditCard className='h-5 w-5 text-[#FF7A3D]' />
                <CardTitle className='text-lg font-serif text-[#1D1D1F]'>Payment Method</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='pt-4'>
              <p className='text-[#1D1D1F] mb-3 font-medium'>{paymentMethod}</p>
              {isPaid ? (
                <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive' className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
                  Not paid
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className='bg-[#FFFBF8] border-[#FFE4D2]'>
            <CardHeader className='border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8] pb-4'>
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-[#FF7A3D]' />
                <CardTitle className='text-lg font-serif text-[#1D1D1F]'>Shipping Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='pt-4'>
              <p className='text-[#1D1D1F] font-medium'>{shippingAddress.fullName}</p>
              <p className='text-[#1D1D1F] mb-2'>
                {shippingAddress.streetAddress}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <p className='text-[#1D1D1F] mb-3'>Phone: {shippingAddress.phoneNumber}</p>
              <div className='flex gap-2'>
                {isShipped ? (
                  <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
                    Shipped at {formatDateTime(shippedAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
                    Not Shipped
                  </Badge>
                )}
                {isDelivered ? (
                  <Badge className='bg-green-100 text-green-700 hover:bg-green-100'>
                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge className='bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
                    Not Delivered
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='bg-[#FFFBF8] border-[#FFE4D2]'>
            <CardHeader className='border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8] pb-4'>
              <div className='flex items-center gap-2'>
                <Truck className='h-5 w-5 text-[#FF7A3D]' />
                <CardTitle className='text-lg font-serif text-[#1D1D1F]'>Order Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='pt-4'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-[#FFF5EE] border-[#FFE4D2]'>
                    <TableHead className='text-[#1D1D1F] font-medium'>ITEM</TableHead>
                    <TableHead className='text-[#1D1D1F] font-medium'>QUANTITY</TableHead>
                    <TableHead className='text-[#1D1D1F] font-medium'>PRICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.slug} className='border-[#FFE4D2] hover:bg-[#FFF5EE]/50 transition-colors'>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center hover:text-[#FF7A3D] transition-colors'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            className='rounded-md'
                          />
                          <span className='ml-3 font-medium'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {item.qty}
                      </TableCell>
                      <TableCell className='text-[#FF7A3D] font-medium'>
                        {formatCurrency(item.price)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className='bg-[#FFFBF8] border-[#FFE4D2] sticky top-[88px]'>
            <CardHeader className='border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8] pb-4'>
              <CardTitle className='text-lg font-serif text-[#1D1D1F]'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='space-y-3'>
                <div className='flex justify-between text-[#1D1D1F]'>
                  <span>Items</span>
                  <span className='font-medium'>{formatCurrency(itemsPrice)}</span>
                </div>
                <div className='flex justify-between text-[#1D1D1F]'>
                  <span>Tax</span>
                  <span className='font-medium'>{formatCurrency(taxPrice)}</span>
                </div>
                <div className='flex justify-between text-[#1D1D1F]'>
                  <span>Shipping</span>
                  <span className='font-medium'>{formatCurrency(shippingPrice)}</span>
                </div>
                <div className='flex justify-between text-[#1D1D1F] pt-3 border-t border-[#FFE4D2]'>
                  <span className='font-medium'>Total</span>
                  <span className='font-medium text-[#FF7A3D]'>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* PayPal Payment */}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div className='mt-6'>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <div className='text-center text-[#1D1D1F] mb-2'>
                      <PrintLoadingState />
                    </div>
                    <PayPalButtons
                      createOrder={handleCreatePayPalOrder}
                      onApprove={handleApprovePayPalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Stripe Payment */}
              {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                <div className='mt-6'>
                  <StripePayment
                    priceInCents={Number(order.totalPrice) * 100}
                    orderId={order.id}
                    clientSecret={stripeClientSecret}
                  />
                </div>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <div className='space-y-3 mt-6 pt-3 border-t border-[#FFE4D2]'>
                  {!isPaid && paymentMethod === 'CashOnDelivery' && (
                    <Button 
                      className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
                      onClick={() =>
                        startTransition(async () => {
                          const res = await updateOrderToPaidCOD(order.id);
                          toast({
                            variant: res.success ? 'default' : 'destructive',
                            description: res.message,
                          });
                        })
                      }
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Mark As Paid'
                      )}
                    </Button>
                  )}
                  
                  {isPaid && !isShipped && (
                    <Button 
                      className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
                      onClick={() =>
                        startTransition(async () => {
                          const res = await shipOrder(order.id);
                          toast({
                            variant: res.success ? 'default' : 'destructive',
                            description: res.message,
                          });
                        })
                      }
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Mark As Shipped'
                      )}
                    </Button>
                  )}
                  
                  {isPaid && isShipped && !isDelivered && (
                    <Button 
                      className='w-full bg-[#FF7A3D] text-white hover:bg-[#ff6a2a] transition-all duration-300'
                      onClick={() =>
                        startTransition(async () => {
                          const res = await deliverOrder(order.id);
                          toast({
                            variant: res.success ? 'default' : 'destructive',
                            description: res.message,
                          });
                        })
                      }
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Mark As Delivered'
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
