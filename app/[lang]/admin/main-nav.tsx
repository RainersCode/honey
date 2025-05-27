'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { Locale } from '@/config/i18n.config';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  lang: Locale;
  dict: {
    admin: {
      nav: {
        overview: string;
        products: string;
        orders: string;
        users: string;
        shipping: string;
        countries: string;
      };
    };
  };
}

const MainNav = ({ className, lang, dict, ...props }: MainNavProps) => {
  const pathname = usePathname();

  const links = [
    {
      title: dict.admin.nav.overview,
      href: `/${lang}/admin/overview`,
    },
    {
      title: dict.admin.nav.products,
      href: `/${lang}/admin/products`,
    },
    {
      title: dict.admin.nav.orders,
      href: `/${lang}/admin/orders`,
    },
    {
      title: dict.admin.nav.users,
      href: `/${lang}/admin/users`,
    },
    {
      title: dict.admin.nav.shipping || 'Shipping',
      href: `/${lang}/admin/shipping`,
    },
    {
      title: dict.admin.nav.countries || 'Countries',
      href: `/${lang}/admin/countries`,
    },
  ];

  return (
    <div className='w-full flex items-center justify-between bg-white h-full'>
      {/* Left side: Logo and Admin title */}
      <div className='flex items-center gap-6'>
        <Link
          href={`/${lang}`}
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
          <span className='font-serif text-xl text-[#4A3F35] tracking-tight font-medium'>
            {APP_NAME}
          </span>
        </Link>

        <div className='h-6 w-px bg-gray-300' />

        <h1 className='text-lg font-semibold text-gray-900'>Admin Dashboard</h1>
      </div>

      {/* Right side: Navigation */}
      <nav
        className={cn(
          'flex items-center space-x-6 lg:space-x-8 bg-white',
          className
        )}
        {...props}
      >
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-[#FF7A3D] relative py-1 px-2',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF7A3D] after:transition-transform after:scale-x-0 hover:after:scale-x-100',
              pathname.includes(item.href)
                ? 'text-[#FF7A3D] after:scale-x-100'
                : 'text-gray-600 after:scale-x-0'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MainNav;
