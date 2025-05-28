import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/login`);
  }

  return <>{children}</>;
} 