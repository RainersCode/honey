import Header from '@/components/shared/header';

export default function AuthLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header lang={lang} />
      <main className='flex-1'>{children}</main>
    </div>
  );
}
