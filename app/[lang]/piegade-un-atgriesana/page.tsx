import { redirect } from 'next/navigation';
import { Locale } from '@/config/i18n.config';

export default async function PiegadeUnAtgriesanaPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  redirect(`/${lang}/delivery-and-returns`);
} 