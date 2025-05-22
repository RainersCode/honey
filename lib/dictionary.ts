import type { Locale } from '@/config/i18n.config'
import type { Dictionary } from '@/types'

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default) as Promise<Dictionary>,
  lv: () => import('@/dictionaries/lv.json').then((module) => module.default) as Promise<Dictionary>,
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default) as Promise<Dictionary>,
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]() 