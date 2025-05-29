import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import CategoryForm from '@/components/admin/category-form';

export const metadata: Metadata = {
  title: 'Create Category',
};

export default async function CreateCategoryPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.createCategory}</h1>
      <div className="max-w-5xl">
        <CategoryForm 
          type="Create" 
          lang={lang} 
          dictionary={dict}
        />
      </div>
    </div>
  );
} 