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
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ page?: string; zone?: string }>;
}) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;
  const searchParamsResolved = await searchParams;

  const page = Number(searchParamsResolved.page) || 1;
  const zone = searchParamsResolved.zone || '';

  const rules = await getAllShippingRules({
    page,
    zone,
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold'>Shipping Rules</h1>
          <p className="text-gray-600">
            Configure shipping rates and maximum weight limits for each shipping method. Orders exceeding the maximum weight will not be allowed.
          </p>
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
              <TableHead>Weight Range</TableHead>
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
                  <div>
                    <span>{rule.minWeight.toString()} - {rule.maxWeight.toString()} kg</span>
                    {Number(rule.maxWeight) >= 100 && (
                      <span className="ml-2 text-amber-600 text-sm">High weight limit</span>
                    )}
                  </div>
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
          urlParamName="page"
        />
      )}
    </div>
  );
}
