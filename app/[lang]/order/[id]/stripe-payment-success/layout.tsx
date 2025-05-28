import { Metadata } from 'next';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return {
    title: dict.order.stripe.success.title,
    description: dict.order.stripe.success.message,
  };
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 