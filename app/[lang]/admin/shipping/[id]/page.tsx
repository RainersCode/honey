import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import { getShippingRuleById } from '@/lib/actions/shipping.actions';
import ShippingRuleForm from '@/components/shipping/shipping-rule-form';
import { notFound } from 'next/navigation';

export default async function UpdateShippingRulePage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  await requireAdmin();
  const { lang, id } = await params;
  const dict = await getDictionary(lang) as any;

  const rule = await getShippingRuleById(id);
  if (!rule) return notFound();

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Update Shipping Rule</h1>
      <div className='max-w-2xl'>
        <ShippingRuleForm type='Update' rule={rule} lang={lang} />
      </div>
    </div>
  );
}
