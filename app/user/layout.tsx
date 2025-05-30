import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import HeaderContainer from '@/components/shared/header/header-container';
import Footer from '@/components/shared/footer';

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex min-h-screen flex-col'>
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
                  height={48}
                  width={48}
                  priority={true}
                  className='object-contain'
                />
              </div>
              <span className='hidden lg:block font-serif text-2xl text-[#1D1D1F] tracking-tight font-medium'>
                {APP_NAME}
              </span>
            </Link>
            <nav className='flex items-center gap-6 sm:gap-8'>
              <Link
                href='/'
                className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                HOME
              </Link>
              <Link
                href='/about'
                className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                ABOUT US
              </Link>
              <Link
                href='/search'
                className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                PRODUCTS
              </Link>
              <Link
                href='/contact'
                className='text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium hidden sm:block transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full'
              >
                CONTACT
              </Link>
              <Menu lang='en' />
            </nav>
          </div>
        </div>
      </HeaderContainer>
      <div className='h-[72px]' /> {/* Spacer for fixed header */}
      <main className='flex-1 wrapper py-8'>{children}</main>
      <Footer lang='en' />
    </div>
  );
}
