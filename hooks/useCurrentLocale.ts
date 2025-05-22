'use client'

import { usePathname } from 'next/navigation';
import { i18n } from '@/config/i18n.config';
 
export function useCurrentLocale() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || i18n.defaultLocale;
  return locale;
} 