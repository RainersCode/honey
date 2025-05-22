'use client'

import { i18n } from '@/config/i18n.config'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
  const pathName = usePathname()

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <div className="flex items-center gap-2">
      {i18n.locales.map((locale) => {
        return (
          <Link
            key={locale}
            href={redirectedPathName(locale)}
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {locale.toUpperCase()}
          </Link>
        )
      })}
    </div>
  )
} 