import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';

const Header = () => {
  return (
    <header className='w-full bg-[#FFFBF8] border-b border-[#1D1D1F]/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto py-5 px-6'>
        <div className='flex items-center justify-between gap-4'>
          <Link 
            href='/' 
            className='flex items-center gap-3 transition-transform hover:opacity-90'
          >
            <div className='relative'>
              <Image
                src='/images/logo.svg'
                alt={`${APP_NAME} logo`}
                height={32}
                width={32}
                priority={true}
                className='object-contain'
              />
            </div>
            <span className='hidden sm:block font-serif text-2xl text-[#1D1D1F] tracking-tight'>
              {APP_NAME}
            </span>
          </Link>

          <nav className='flex items-center gap-8'>
            <Link 
              href='/about'
              className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-colors'
            >
              About Us
            </Link>
            <Link 
              href='/search'
              className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-colors'
            >
              Products
            </Link>
            <Link 
              href='/contact'
              className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-colors'
            >
              Contact
            </Link>
            <Menu />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
