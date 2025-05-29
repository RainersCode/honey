import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return <>{children}</>;
  }
  
  const { lang } = resolvedParams;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${lang}/login`);
  }

  return <>{children}</>;
} 