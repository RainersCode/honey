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
        title: 'Delivery & Returns | Honey Farm',
        description: 'Information about delivery and return policies.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.delivery_returns.meta.title,
      description: dict.delivery_returns.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Delivery & Returns | Honey Farm',
      description: 'Information about delivery and return policies.',
    };
  }
}

export default async function DeliveryAndReturnsPage({
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
              <h1 className="text-4xl font-serif text-[#1D1D1F] mb-4">Delivery & Returns</h1>
              <p className="text-gray-600">Information about delivery and return policies.</p>
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
            <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.delivery_returns.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {dict.delivery_returns.subtitle}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.delivery_returns.delivery.title}</h2>
              <p className="text-gray-600">{dict.delivery_returns.delivery.description}</p>
              
              <div className="mt-6">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{dict.delivery_returns.delivery.methods.title}</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {dict.delivery_returns.delivery.methods.list.map((method: string, index: number) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{dict.delivery_returns.delivery.times.title}</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {dict.delivery_returns.delivery.times.list.map((time: string, index: number) => (
                    <li key={index}>{time}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.delivery_returns.returns.title}</h2>
              <p className="text-gray-600">{dict.delivery_returns.returns.description}</p>

              <div className="mt-6">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{dict.delivery_returns.returns.process.title}</h3>
                <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                  {dict.delivery_returns.returns.process.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{dict.delivery_returns.returns.conditions.title}</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {dict.delivery_returns.returns.conditions.list.map((condition: string, index: number) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.delivery_returns.refunds.title}</h2>
              <p className="text-gray-600">{dict.delivery_returns.refunds.description}</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                {dict.delivery_returns.refunds.terms.map((term: string, index: number) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.delivery_returns.contact.title}</h2>
              <p className="text-gray-600">{dict.delivery_returns.contact.description}</p>
              <div className="mt-4 text-gray-600">
                <p>{dict.delivery_returns.contact.email}: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                <p>{dict.delivery_returns.contact.phone}: {process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
} 