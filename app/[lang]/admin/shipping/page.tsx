import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import {
  getAllShippingRules,
  deleteShippingRule,
} from '@/lib/actions/shipping.actions';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/shared/pagination';
import DeleteDialog from '@/components/shared/delete-dialog';
import Link from 'next/link';

export default async function AdminShippingPage({
  params: { lang },
  searchParams,
}: {
  params: { lang: Locale };
  searchParams: { page?: string; zone?: string };
}) {
  await requireAdmin();
  const dict = await getDictionary(lang);

  const page = Number(searchParams.page) || 1;
  const zone = searchParams.zone || '';

  const rules = await getAllShippingRules({
    page,
    zone,
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h1 className='text-3xl font-bold'>Shipping Rules</h1>
          {zone && (
            <div className='flex items-center gap-2'>
              <span>Filtered by zone "{zone}"</span>
              <Button asChild variant='outline' size='sm'>
                <Link href={`/${lang}/admin/shipping`}>Clear Filter</Link>
              </Button>
            </div>
          )}
        </div>
        <Button asChild>
          <Link href={`/${lang}/admin/shipping/create`}>Create Rule</Link>
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone</TableHead>
              <TableHead>Weight Range (kg)</TableHead>
              <TableHead className='text-right'>Price</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.data.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell>{rule.zone}</TableCell>
                <TableCell>
                  {rule.minWeight.toString()} - {rule.maxWeight.toString()}
                </TableCell>
                <TableCell className='text-right'>
                  {formatCurrency(Number(rule.price))}
                </TableCell>
                <TableCell>{rule.carrier}</TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2'>
                    <Button asChild variant='outline' size='sm'>
                      <Link href={`/${lang}/admin/shipping/${rule.id}`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog id={rule.id} action={deleteShippingRule} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {rules.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={rules.totalPages}
          baseUrl={`/${lang}/admin/shipping`}
          zone={zone}
        />
      )}
    </div>
  );
}
