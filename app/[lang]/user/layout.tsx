import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/login`);
  }

  return <>{children}</>;
} 