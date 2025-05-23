'use client';

import { i18n } from '@/config/i18n.config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

// Language configuration with flags and labels
const languageConfig = {
  en: {
    flag: '/images/flags/us.svg',
    label: 'English',
    code: 'EN',
    show: true,
  },
  lv: {
    flag: '/images/flags/lv.svg',
    label: 'Latviešu',
    code: 'LV',
    show: true,
  },
  ru: {
    flag: '/images/flags/ru.svg',
    label: 'Русский',
    code: 'RU',
    show: false, // Hide Russian but keep implementation
  },
};

export default function LanguageSwitcher() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  // Get current language from pathname
  const getCurrentLanguage = () => {
    if (!pathName) return 'en';
    const segments = pathName.split('/');
    const currentLang = segments[1];
    return i18n.locales.includes(currentLang as any) ? currentLang : 'en';
  };

  const currentLang = getCurrentLanguage();
  const currentConfig =
    languageConfig[currentLang as keyof typeof languageConfig];

  // Filter languages to show only visible ones
  const visibleLanguages = i18n.locales.filter(
    (locale) => languageConfig[locale as keyof typeof languageConfig].show
  );

  return (
    <div className='relative'>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#4A3F35] hover:text-[#FF7A3D] transition-colors duration-300 bg-white/80 hover:bg-white rounded-md border border-[#FFE4D2] hover:border-[#FF7A3D]'
      >
        <Image
          src={currentConfig.flag}
          alt={`${currentConfig.label} flag`}
          width={20}
          height={15}
          className='rounded-sm'
          unoptimized
        />
        <span className='hidden sm:inline'>{currentConfig.code}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-[#FFE4D2] z-20 overflow-hidden'>
            {visibleLanguages.map((locale) => {
              const config =
                languageConfig[locale as keyof typeof languageConfig];
              const isActive = locale === currentLang;

              return (
                <Link
                  key={locale}
                  href={redirectedPathName(locale)}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-[#FFF5EE] text-[#FF7A3D] font-medium'
                      : 'text-[#4A3F35] hover:bg-[#FFFBF8] hover:text-[#FF7A3D]'
                  }`}
                >
                  <Image
                    src={config.flag}
                    alt={`${config.label} flag`}
                    width={20}
                    height={15}
                    className='rounded-sm'
                    unoptimized
                  />
                  <div className='flex flex-col'>
                    <span className='font-medium'>{config.code}</span>
                    <span className='text-xs text-gray-500'>
                      {config.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className='ml-auto w-2 h-2 bg-[#FF7A3D] rounded-full' />
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
