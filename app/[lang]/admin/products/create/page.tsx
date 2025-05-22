import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import ProductForm from '@/components/admin/product-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default async function CreateProductPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  await requireAdmin();
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.createProduct}</h1>
      <div className="max-w-5xl">
        <ProductForm type="Create" lang={lang} />
      </div>
    </div>
  );
} 