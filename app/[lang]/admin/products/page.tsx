import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { getAllProducts } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import { formatCurrency, formatId } from '@/lib/utils';
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
import CategoryManagement from '@/components/admin/category-management';
import ProductActions from '@/components/admin/product-actions';
import Link from 'next/link';
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

export default async function AdminProductsPage({ params, searchParams }: PageProps) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const [products, categories] = await Promise.all([
    getAllProducts({
      query: searchText,
      page,
      category,
    }),
    getAllCategories(),
  ]);

  return (
    <div className="space-y-8">
      <CategoryManagement categories={categories} dictionary={dict} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{dict.admin.products}</h1>
            {searchText && (
              <div className="flex items-center gap-2">
                <span>Filtered by "{searchText}"</span>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${lang}/admin/products`}>Clear Filter</Link>
                </Button>
              </div>
            )}
          </div>
          <Button asChild>
            <Link href={`/${lang}/admin/products/create`}>Create Product</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{formatId(product.id)}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>
                    {product.category.name}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.rating}</TableCell>
                  <TableCell className="text-right">
                    <ProductActions 
                      productId={product.id} 
                      lang={lang} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={products.totalPages}
          baseUrl={`/${lang}/admin/products`}
        />
      </div>
    </div>
  );
} 