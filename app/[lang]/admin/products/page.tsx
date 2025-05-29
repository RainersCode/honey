import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { getProducts } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import { DataTable } from '@/components/admin/product-table';
import { columns } from '@/components/admin/product-columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
};

interface PageProps {
  params: Promise<{ lang: Locale }>;
  searchParams: {
    page?: string;
    query?: string;
    category?: string;
  };
}

export default async function ProductsPage({ params, searchParams }: PageProps) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  const page = Number(searchParams.page) || 1;
  const query = searchParams.query || '';
  const category = searchParams.category || '';

  const [products, categories] = await Promise.all([
    getProducts({ page, query, category }),
    getAllCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dict.admin.products}</h1>
        <Link href={`/${lang}/admin/products/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {dict.admin.createProduct}
          </Button>
        </Link>
      </div>
      <div className="container mx-auto py-10">
        <DataTable
          columns={columns}
          data={products.data}
          pageCount={products.totalPages}
          categories={categories}
          dictionary={dict}
          lang={lang}
        />
      </div>
    </div>
  );
} 