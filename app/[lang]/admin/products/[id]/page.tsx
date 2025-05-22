import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import ProductForm from '@/components/admin/product-form';
import { getProductById } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Update Product',
};

export default async function UpdateProductPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  await requireAdmin();
  const dict = await getDictionary(lang);
  
  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.updateProduct}</h1>
      <div className="max-w-5xl">
        <ProductForm 
          type="Update" 
          product={product} 
          productId={product.id}
          lang={lang}
        />
      </div>
    </div>
  );
} 