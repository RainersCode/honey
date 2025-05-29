import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import MainNav from './main-nav';

export default async function AdminLayout({
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
      <div className='fixed inset-0 bg-gray-50 flex flex-col overflow-hidden z-[90]'>
        {/* Admin header that overlays the main header */}
        <header className='absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-[100] h-[72px]'>
          <div className='max-w-none h-full'>
            <div className='flex items-center h-full px-8'>
              <MainNav lang="en" dict={{}} />
            </div>
          </div>
        </header>

        {/* Content area with proper spacing for header */}
        <main className='flex-1 pt-[72px] overflow-auto bg-gray-50'>
          <div className='max-w-[1440px] mx-auto px-8 py-6'>{children}</div>
        </main>
      </div>
    );
  }
  
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang) as any;

  return (
    <div className='fixed inset-0 bg-gray-50 flex flex-col overflow-hidden z-[90]'>
      {/* Admin header that overlays the main header */}
      <header className='absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-[100] h-[72px]'>
        <div className='max-w-none h-full'>
          <div className='flex items-center h-full px-8'>
            <MainNav lang={lang} dict={dict} />
          </div>
        </div>
      </header>

      {/* Content area with proper spacing for header */}
      <main className='flex-1 pt-[72px] overflow-auto bg-gray-50'>
        <div className='max-w-[1440px] mx-auto px-8 py-6'>{children}</div>
      </main>
    </div>
  );
}
