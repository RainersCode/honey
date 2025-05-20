import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'My Orders',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <div className='max-w-5xl mx-auto'>
      <Card className='bg-[#FFFBF8] border-[#FFE4D2]'>
        <CardHeader className='space-y-1 flex flex-row items-center gap-2 border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8]'>
          <Package className='h-5 w-5 text-[#FF7A3D]' />
          <CardTitle className='text-xl font-serif text-[#1D1D1F]'>Order History</CardTitle>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-[#FFF5EE] border-[#FFE4D2]'>
                  <TableHead className='text-[#1D1D1F] font-medium'>ORDER ID</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>DATE</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>TOTAL</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>PAID</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>SHIPPED</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>DELIVERED</TableHead>
                  <TableHead className='text-[#1D1D1F] font-medium'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order) => (
                  <TableRow key={order.id} className='border-[#FFE4D2] hover:bg-[#FFF5EE]/50 transition-colors'>
                    <TableCell className='font-medium'>{formatId(order.id)}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                    <TableCell className='text-[#FF7A3D] font-medium'>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      {order.isPaid && order.paidAt ? (
                        <span className='text-green-600'>{formatDateTime(order.paidAt).dateTime}</span>
                      ) : (
                        <span className='text-yellow-600'>Not Paid</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isShipped && order.shippedAt ? (
                        <span className='text-green-600'>{formatDateTime(order.shippedAt).dateTime}</span>
                      ) : (
                        <span className='text-yellow-600'>Not Shipped</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered && order.deliveredAt ? (
                        <span className='text-green-600'>{formatDateTime(order.deliveredAt).dateTime}</span>
                      ) : (
                        <span className='text-yellow-600'>Not Delivered</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        asChild 
                        variant='outline' 
                        size='sm'
                        className='border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-all duration-300'
                      >
                        <Link href={`/order/${order.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.totalPages > 1 && (
              <div className='mt-4 flex justify-center'>
                <Pagination
                  page={Number(page) || 1}
                  totalPages={orders?.totalPages}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
