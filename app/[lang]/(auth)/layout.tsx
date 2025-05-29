import Header from '@/components/shared/header';
import { Locale } from '@/config/i18n.config';

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <div className='flex min-h-screen flex-col'>
        <main className='flex-1'>{children}</main>
      </div>
    );
  }
  
  const { lang } = resolvedParams;
  
  return (
    <div className='flex min-h-screen flex-col'>
      <Header lang={lang} />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
