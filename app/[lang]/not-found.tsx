import { getDictionary } from '@/lib/dictionary'
import { Locale } from '@/config/i18n.config'
import Link from 'next/link'

export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium"
        >
          Go back home
        </Link>
      </div>
    );
  }
  
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang)

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-bold mb-4">{dict.notFound.title}</h2>
      <p className="text-gray-600 mb-8">{dict.notFound.description}</p>
      <Link
        href={`/${lang}`}
        className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium"
      >
        {dict.notFound.backHome}
      </Link>
    </div>
  )
} 