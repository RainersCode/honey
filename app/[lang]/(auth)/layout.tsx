import Header from '@/components/shared/header';
import { Locale } from '@/config/i18n.config';

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>) {
  const { lang } = await params;
  
  return (
    <div className='flex min-h-screen flex-col'>
      <Header lang={lang} />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
