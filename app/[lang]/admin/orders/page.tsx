import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';

export default async function AdminOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  await requireAdmin();
  
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p>Loading...</p>
      </div>
    );
  }
  
  const { lang } = resolvedParams;
  const searchParamsData = await searchParams;
  const dict = await getDictionary(lang) as any;
  
  const page = Number(searchParamsData.page) || 1;
  const searchText = searchParamsData.query || '';

  const orders = await getAllOrders({
    page,
    query: searchText,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{dict.admin.orders}</h1>
          {searchText && (
            <div className="flex items-center gap-2">
              <span>{dict.admin.orderStatus.filteredBy} "{searchText}"</span>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${lang}/admin/orders`}>{dict.admin.orderStatus.clearFilter}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Shipped</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : dict.admin.orderStatus.notPaid}
                </TableCell>
                <TableCell>
                  {order.isShipped && order.shippedAt
                    ? formatDateTime(order.shippedAt).dateTime
                    : dict.admin.orderStatus.notShipped}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : dict.admin.orderStatus.notDelivered}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/${lang}/order/${order.id}`}>{dict.admin.orderStatus.details}</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {orders.totalPages > 1 && (
        <Pagination 
          page={page} 
          totalPages={orders.totalPages}
        />
      )}
    </div>
  );
} 