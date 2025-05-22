'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { Locale } from '@/config/i18n.config';

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  lang: Locale;
  dict: {
    admin: {
      nav: {
        overview: string;
        products: string;
        orders: string;
        users: string;
      };
    };
  };
}

const MainNav = ({
  className,
  lang,
  dict,
  ...props
}: MainNavProps) => {
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
  ];

  return (
    <nav
      className={cn('flex items-center space-x-6 lg:space-x-8', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary relative py-1',
            'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:transition-transform after:scale-x-0 hover:after:scale-x-100',
            pathname.includes(item.href)
              ? 'text-primary after:scale-x-100'
              : 'text-muted-foreground after:scale-x-0'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav; 