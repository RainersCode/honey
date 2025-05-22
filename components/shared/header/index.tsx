import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import HeaderContainer from './header-container';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  return (
    <>
      <HeaderContainer>
        <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between gap-4'>
            <Link 
              href='/' 
              className='flex items-center gap-3 transition-all duration-300 hover:opacity-80'
            >
              <div className='relative'>
                <Image
                  src='/images/logo.svg'
                  alt={`${APP_NAME} logo`}
                  height={36}
                  width={36}
                  priority={true}
                  className='object-contain'
                />
              </div>
              <span className='hidden sm:block font-serif text-2xl text-[#4A3F35] tracking-tight font-medium'>
                {APP_NAME}
              </span>
            </Link>

            <nav className='flex items-center gap-6 sm:gap-8'>
              <Link 
                href='/'
                className='text-[#4A3F35] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                HOME
              </Link>
              <Link 
                href='/about'
                className='text-[#4A3F35] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                ABOUT US
              </Link>
              <Link 
                href='/search'
                className='text-[#4A3F35] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                PRODUCTS
              </Link>
              <Link 
                href='/contact'
                className='text-[#4A3F35] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                CONTACT
              </Link>
              <LanguageSwitcher />
              <Menu />
            </nav>
          </div>
        </div>
      </HeaderContainer>
      <div className="h-[72px]" /> {/* Spacer for fixed header */}
    </>
  );
};

export default Header;
