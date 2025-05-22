import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import MainNav from './main-nav';

export default async function AdminLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dict = await getDictionary(lang);

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b bg-white sticky top-0 z-[100]'>
        <div className='max-w-[1440px] mx-auto'>
          <div className='flex items-center h-16 px-8'>
            <MainNav lang={lang} dict={dict} />
          </div>
        </div>
      </header>

      <main className='flex-1 max-w-[1440px] mx-auto px-8 py-6 relative z-0'>
        {children}
      </main>
    </div>
  );
} 