import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { getProductById } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import ProductForm from '@/components/admin/product-form';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Product',
};

export default async function AdminProductPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  await requireAdmin();
  const { lang, id } = await params;
  const dict = await getDictionary(lang) as any;

  const [product, categories] = await Promise.all([
    id === 'create' ? null : getProductById(id),
    getAllCategories(),
  ]);

  if (id !== 'create' && !product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {id === 'create' ? dict.admin.createProduct : dict.admin.editProduct}
      </h1>
      <ProductForm 
        type="Update"
        product={product} 
        productId={id}
        lang={lang}
        categories={categories}
        dictionary={dict} 
      />
    </div>
  );
} 