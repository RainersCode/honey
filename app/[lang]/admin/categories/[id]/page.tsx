import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';
import CategoryForm from '@/components/admin/category-form';
import { notFound } from 'next/navigation';
import { prismaSingleton as prisma } from '@/db/prisma';

export const metadata: Metadata = {
  title: 'Edit Category',
};

export default async function EditCategoryPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string };
}) {
  await requireAdmin();
  const dict = await getDictionary(lang);

  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{dict.admin.editCategory}</h1>
      <div className="max-w-5xl">
        <CategoryForm 
          type="Update" 
          category={category}
          categoryId={id}
          lang={lang} 
          dictionary={dict}
        />
      </div>
    </div>
  );
} 