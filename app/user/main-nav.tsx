'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';

const links = [
  {
    title: 'PROFILE',
    href: '/user/profile',
  },
  {
    title: 'ORDERS',
    href: '/user/orders',
  },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn('flex items-center gap-6 sm:gap-8', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-[#1D1D1F] hover:text-[#FF7A3D] text-sm font-medium transition-all duration-300 relative after:content-[""] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#FF7A3D] after:transition-all after:duration-300 hover:after:w-full',
            pathname === item.href && 'text-[#FF7A3D] after:w-full'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
