import Header from '@/components/shared/header';

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  
  return (
    <div className='flex min-h-screen flex-col'>
      <Header lang={lang} />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
