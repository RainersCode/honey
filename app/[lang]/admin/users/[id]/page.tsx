import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { getUserById } from '@/lib/actions/user.actions';
import { notFound } from 'next/navigation';
import UserEditForm from '@/components/admin/user-edit-form';

interface PageProps {
  params: Promise<{ 
    lang: Locale; 
    id: string;
  }>;
}

export default async function AdminUserDetailsPage({ params }: PageProps) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang) as any;

  const user = await getUserById(id);
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            {dict.admin.editUser}
          </h2>
          <p className="text-sm text-gray-500">
            {dict.admin.userDetails}
          </p>
        </div>
      </div>

      <UserEditForm user={user} lang={lang} dict={dict} />
    </div>
  );
} 