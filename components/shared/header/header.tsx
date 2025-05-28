import Link from 'next/link';
import Image from 'next/image';
import CategoryDrawer from './CategoryDrawer';

const Header = async ({ lang }: { lang: string }) => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <nav className='container flex h-16 items-center'>
        <div className='flex items-center gap-2'>
          <CategoryDrawer lang={lang} />
          <Link href={`/${lang}`} className='flex items-center gap-2'>
            <Image src='/logo.svg' alt='Logo' width={32} height={32} />
            <span className='font-serif text-xl'>Honey</span>
          </Link>
        </div>

        // ... rest of the code ...
      </nav>
    </header>
  );
};

export default Header; 