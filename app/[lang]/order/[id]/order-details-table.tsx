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
import { Package, CreditCard, Truck, MapPin, Pencil, Download } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { generateReceipt } from '@/lib/utils/generate-receipt';

interface OrderDetailsTableProps {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
  lang: Locale;
  dict: any;
}

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
  lang,
  dict
}: OrderDetailsTableProps) => {
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
      status = dict.order.paypal.loading;
    } else if (isRejected) {
      status = dict.order.paypal.error;
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
        {isPending ? dict.order.buttons.processing : dict.order.buttons.markAsPaid}
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
        {isPending ? dict.order.buttons.processing : dict.order.buttons.markAsDelivered}
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
        {isPending ? dict.order.buttons.processing : dict.order.buttons.markAsShipped}
      </Button>
    );
  };

  const handleDownloadReceipt = async () => {
    const success = await generateReceipt(order, dict, true);
    if (!success) {
      toast({
        variant: 'destructive',
        description: dict.order.receipt.error,
      });
    }
  };

  return (
    <div className="wrapper py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[#FF7A3D] mb-8">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-serif">{dict.order.title} {formatId(id)}</h1>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF7A3D]" />
                  <CardTitle className="text-xl font-serif">{dict.order.shipping.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-[#1D1D1F]">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  {shippingAddress.deliveryMethod === 'omniva' ? (
                    <>
                      <p className="text-muted-foreground">
                        {dict.shipping.form.omnivaLocation}:{' '}
                        {shippingAddress.omnivaLocationDetails?.name}
                      </p>
                      <p className="text-muted-foreground">
                        {shippingAddress.omnivaLocationDetails?.address}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">
                      {shippingAddress.streetAddress}, {shippingAddress.city}{' '}
                      {shippingAddress.postalCode}, {shippingAddress.country}
                    </p>
                  )}
                  <p className="text-muted-foreground">{dict.order.shipping.phone}: {shippingAddress.phoneNumber}</p>
                  {isDelivered ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {dict.order.shipping.deliveredAt} {formatDateTime(deliveredAt!).dateTime}
                    </Badge>
                  ) : isShipped ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {dict.order.shipping.shippedAt} {formatDateTime(shippedAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      {dict.order.shipping.notShipped}
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
                  <CardTitle className="text-xl font-serif">{dict.order.payment.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-[#1D1D1F]">
                  <p className="font-medium">{dict.order.payment.method}: {paymentMethod}</p>
                  {isPaid ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      {dict.order.payment.paidAt} {formatDateTime(paidAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      {dict.order.payment.notPaid}
                    </Badge>
                  )}

                  {/* Payment Actions */}
                  {!isPaid && (
                    <div className="mt-4">
                      {paymentMethod === 'PayPal' ? (
                        <PayPalScriptProvider
                          options={{
                            clientId: paypalClientId,
                            currency: 'USD',
                          }}
                        >
                          <PrintLoadingState />
                          <PayPalButtons
                            createOrder={handleCreatePayPalOrder}
                            onApprove={handleApprovePayPalOrder}
                          />
                        </PayPalScriptProvider>
                      ) : paymentMethod === 'Stripe' && stripeClientSecret ? (
                        <StripePayment
                          clientSecret={stripeClientSecret}
                          lang={lang}
                        />
                      ) : isAdmin ? (
                        <MarkAsPaidButton />
                      ) : null}
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
                  <CardTitle className="text-xl font-serif">{dict.order.items.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{dict.order.items.image}</TableHead>
                      <TableHead>{dict.order.items.name}</TableHead>
                      <TableHead>{dict.order.items.quantity}</TableHead>
                      <TableHead>{dict.order.items.price}</TableHead>
                      <TableHead>{dict.order.items.total}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="relative h-20 w-20">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/${lang}/product/${item.productId}`}
                            className="text-[#FF7A3D] hover:underline"
                          >
                            {item.name}
                          </Link>
                        </TableCell>
                        <TableCell>{item.qty}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>
                          {formatCurrency(Number(item.price) * item.qty)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Card */}
          <div>
            <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300 sticky top-4">
              <CardHeader className="border-b border-[#FFE4D2] pb-4">
                <CardTitle className="text-xl font-serif">{dict.order.summary.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">{dict.order.summary.items}</p>
                    <p className="font-medium">{formatCurrency(itemsPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">{dict.order.summary.shipping}</p>
                    <p className="font-medium">{formatCurrency(shippingPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">{dict.order.summary.tax}</p>
                    <p className="font-medium">{formatCurrency(taxPrice)}</p>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <p className="font-medium">{dict.order.summary.total}</p>
                    <p className="font-medium">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && !isDelivered && (
                  <div className="mt-6 space-y-2">
                    {!isShipped && <MarkAsShippedButton />}
                    {isShipped && <MarkAsDeliveredButton />}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
