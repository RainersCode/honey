import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // For mobile, show only the last 2 items to save space
  const visibleItems = items.length > 2 ? items.slice(-2) : items;
  const hasCollapsedItems = items.length > 2;

  return (
    <nav className='flex' aria-label='Breadcrumb'>
      <ol className='flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base overflow-hidden'>
        <li className='flex-shrink-0'>
          <Link
            href='/'
            className='text-gray-500 hover:text-[#FF7A3D] transition-colors flex items-center'
          >
            <Home className='h-3 w-3 sm:h-4 sm:w-4' />
            <span className='hidden sm:inline ml-1'>Home</span>
          </Link>
        </li>

        {hasCollapsedItems && (
          <li className='flex items-center sm:hidden'>
            <ChevronRight className='h-3 w-3 text-gray-400 mx-0.5' />
            <span className='text-gray-400 text-xs'>...</span>
          </li>
        )}

        {visibleItems.map((item, index) => (
          <li key={item.href} className='flex items-center min-w-0'>
            <ChevronRight className='h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mx-0.5 sm:mx-1 flex-shrink-0' />
            {index === visibleItems.length - 1 ? (
              <span className='text-[#FF7A3D] font-medium truncate max-w-[120px] sm:max-w-none'>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className='text-gray-500 hover:text-[#FF7A3D] transition-colors truncate max-w-[80px] sm:max-w-none'
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
