import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { requireAdmin } from '@/lib/auth-guard';
import ShippingRuleForm from '@/components/shipping/shipping-rule-form';

export default async function CreateShippingRulePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  await requireAdmin();
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Create Shipping Rule</h1>
      <div className='max-w-2xl'>
        <ShippingRuleForm type='Create' lang={lang} />
      </div>
    </div>
  );
}
