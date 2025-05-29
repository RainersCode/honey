import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Container } from '@/components/ui/container';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.lang) {
      // Fallback metadata if params is not available during static generation
      return {
        title: 'Payment Information | Honey Farm',
        description: 'Payment methods and delivery information.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.payment_page.meta.title,
      description: dict.payment_page.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Payment Information | Honey Farm',
      description: 'Payment methods and delivery information.',
    };
  }
}

export default async function PaymentPage({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <Container>
        <div className="py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-serif text-[#1D1D1F] mb-4">Payment Information</h1>
              <p className="text-gray-600">Payment methods and delivery information.</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
  
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang) as any;

  return (
    <Container>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.payment_page.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.payment_page.methods.title}</h2>
              <p className="text-gray-600 mb-4">{dict.payment_page.methods.description}</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-3">
                <li>
                  {dict.payment_page.methods.online_banking}:
                  <ul className="list-none mt-2 space-y-1">
                    {dict.payment_page.methods.banks.map((bank: string, index: number) => (
                      <li key={index}>• {bank}</li>
                    ))}
                  </ul>
                </li>
                <li>{dict.payment_page.methods.invoice}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.payment_page.delivery.title}</h2>
              <p className="text-gray-600 mb-4">{dict.payment_page.delivery.description}</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-3">
                <li>{dict.payment_page.delivery.invoice_note}</li>
              </ul>
            </section>

            <section className="mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-serif text-[#1D1D1F] mb-4">{dict.payment_page.important.title}</h2>
                <p className="text-gray-600">{dict.payment_page.important.description}</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.payment_page.contact.title}</h2>
              <p className="text-gray-600">{dict.payment_page.contact.description}</p>
              <div className="mt-4 text-gray-600">
                <p>{dict.payment_page.contact.email}: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                <p>{dict.payment_page.contact.phone}: {process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
} 