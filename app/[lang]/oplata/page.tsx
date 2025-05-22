import { redirect } from 'next/navigation';
import { Locale } from '@/config/i18n.config';

export default async function OplataPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  redirect(`/${lang}/payment`);
} 