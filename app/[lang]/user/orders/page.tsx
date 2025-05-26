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
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Container } from '@/components/ui/container';
import { Package, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReceipt } from '@/lib/utils/generate-receipt';
import DownloadReceiptButton from '@/components/shared/download-receipt-button';

export const generateMetadata = async ({
  params: { lang },
}: {
  params: { lang: Locale };
}): Promise<Metadata> => {
  const dict = await getDictionary(lang);
  return {
    title: dict.user.orders,
  };
};

const OrdersPage = async ({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: { page: string };
}) => {
  const dict = await getDictionary(lang);
  const { page } = searchParams;

  const orders = await getMyOrders({
    page: Number(page) || 1,
  });

  return (
    <Container>
      <div className="py-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#FF7A3D]" />
              <h2 className="h2-bold text-[#1D1D1F]">{dict.user.orders}</h2>
            </div>
            <p className="text-muted-foreground">{dict.orders.description}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#FFE4D2] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FFF5EE] border-b border-[#FFE4D2]">
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.id}</TableHead>
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.date}</TableHead>
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.total}</TableHead>
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.paid}</TableHead>
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.delivered}</TableHead>
                  <TableHead className="text-[#1D1D1F] font-medium">{dict.orders.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.data.map((order) => (
                  <TableRow key={order.id} className="border-b border-[#FFE4D2]">
                    <TableCell className="font-medium">{formatId(order.id)}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      {order.isPaid && order.paidAt ? (
                        <span className="text-green-600">
                          {formatDateTime(order.paidAt).dateTime}
                        </span>
                      ) : (
                        <span className="text-red-600">{dict.orders.notPaid}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered && order.deliveredAt ? (
                        <span className="text-green-600">
                          {formatDateTime(order.deliveredAt).dateTime}
                        </span>
                      ) : (
                        <span className="text-yellow-600">{dict.orders.notDelivered}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/${lang}/order/${order.id}`}
                          className="text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200"
                        >
                          {dict.orders.details}
                        </Link>
                        {order.isPaid && (
                          <DownloadReceiptButton 
                            order={order}
                            dict={dict}
                            title={dict.orders.downloadReceipt}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.totalPages > 1 && (
              <div className="p-4 border-t border-[#FFE4D2]">
                <Pagination
                  page={Number(page) || 1}
                  totalPages={orders.totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrdersPage; 