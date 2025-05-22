import { getDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'
import Link from 'next/link'

export default async function NotFound({
  params: { lang }
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{dict.common.error}</p>
      <Link
        href={`/${lang}`}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {dict.navigation.home}
      </Link>
    </div>
  )
} 