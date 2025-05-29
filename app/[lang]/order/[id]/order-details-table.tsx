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
  updateOrderToPaidCOD,
  deliverOrder,
  shipOrder,
} from '@/lib/actions/order.actions';
import StripePayment from './stripe-payment';
import { Package, CreditCard, Truck, MapPin, Pencil, Download } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Locale } from '@/config/i18n.config';
import { generateReceipt } from '@/lib/utils/generate-receipt';
import DownloadReceiptButton from '@/components/shared/download-receipt-button';

interface OrderDetailsTableProps {
  order: Omit<Order, 'paymentResult'>;
  isAdmin: boolean;
  stripeClientSecret: string | null;
  lang: Locale;
  dict: any;
}

const OrderDetailsTable = ({
  order,
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

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type='button'
        disabled={isPending}
        className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white'
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
        className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white'
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
        className='w-full bg-[#FF7A3D] hover:bg-[#FF7A3D]/90 text-white mb-2'
        onClick={() =>
          startTransition(async () => {
            const res = await shipOrder(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? dict.order.buttons.processing : dict.order.buttons.markAsShipped}
      </Button>
    );
  };

  const handleDownloadReceipt = async () => {
    const success = await generateReceipt(order, dict);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information Card */}
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
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                      {dict.order.shipping.deliveredAt} {formatDateTime(deliveredAt!).dateTime}
                    </Badge>
                  ) : isShipped ? (
                    <Badge className="bg-[#FF7A3D]/10 text-[#FF7A3D] hover:bg-[#FF7A3D]/10 border-[#FF7A3D]/20">
                      {dict.order.shipping.shippedAt} {formatDateTime(shippedAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
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
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                      {dict.order.payment.paidAt} {formatDateTime(paidAt!).dateTime}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                      {dict.order.payment.notPaid}
                    </Badge>
                  )}

                  {/* Payment Actions */}
                  {!isPaid && (
                    <div className="mt-4">
                      {paymentMethod === 'Stripe' && stripeClientSecret ? (
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
                    <TableRow className="border-b border-[#FFE4D2]">
                      <TableHead className="text-[#1D1D1F] font-medium">{dict.order.items.image}</TableHead>
                      <TableHead className="text-[#1D1D1F] font-medium">{dict.order.items.name}</TableHead>
                      <TableHead className="text-[#1D1D1F] font-medium">{dict.order.items.quantity}</TableHead>
                      <TableHead className="text-[#1D1D1F] font-medium">{dict.order.items.price}</TableHead>
                      <TableHead className="text-[#1D1D1F] font-medium">{dict.order.items.total}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.productId} className="border-b border-[#FFE4D2]/50">
                        <TableCell>
                          <div className="relative h-20 w-20 border border-[#FFE4D2] rounded-md overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/${lang}/product/${item.productId}`}
                            className="text-[#FF7A3D] hover:text-[#ff6a24] hover:underline font-medium transition-colors duration-200"
                          >
                            {item.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-[#1D1D1F] font-medium">{item.qty}</TableCell>
                        <TableCell className="text-[#1D1D1F] font-medium">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-[#1D1D1F] font-medium">
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
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-[#1D1D1F]/70">{dict.order.summary.items}</p>
                    <p className="font-medium text-[#1D1D1F]">{formatCurrency(itemsPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#1D1D1F]/70">{dict.order.summary.shipping}</p>
                    <p className="font-medium text-[#1D1D1F]">{formatCurrency(shippingPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#1D1D1F]/70">{dict.order.summary.tax}</p>
                    <p className="font-medium text-[#1D1D1F]">{formatCurrency(taxPrice)}</p>
                  </div>
                  <div className="flex justify-between border-t border-[#FFE4D2] pt-3">
                    <p className="font-bold text-lg text-[#1D1D1F]">{dict.order.summary.total}</p>
                    <p className="font-bold text-xl text-[#FF7A3D]">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>

                {/* Download Receipt Button */}
                {order.isPaid && (
                  <div className="mt-6 pt-4 border-t border-[#FFE4D2]">
                    <DownloadReceiptButton 
                      order={order}
                      dict={dict}
                      title={dict.orders.downloadReceipt}
                    />
                  </div>
                )}

                {/* Admin Actions */}
                {isAdmin && !isDelivered && (
                  <div className="mt-6 pt-4 border-t border-[#FFE4D2] space-y-3">
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

