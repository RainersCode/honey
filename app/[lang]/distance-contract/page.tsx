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
        title: 'Distance Contract | Honey Farm',
        description: 'Distance selling contract terms and conditions.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.distance_contract.meta.title,
      description: dict.distance_contract.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Distance Contract | Honey Farm',
      description: 'Distance selling contract terms and conditions.',
    };
  }
}

export default async function DistanceContractPage({
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
              <h1 className="text-4xl font-serif text-[#1D1D1F] mb-4">Distance Contract</h1>
              <p className="text-gray-600">Distance selling contract terms and conditions.</p>
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
            <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.distance_contract.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <p className="text-gray-600">{dict.distance_contract.intro.description1}</p>
              <p className="text-gray-600 mt-4">{dict.distance_contract.intro.description2}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.terms.title}</h2>
              <ol className="list-decimal pl-6 text-gray-600 space-y-4">
                {dict.distance_contract.terms.list.map((term: any, index: number) => (
                  <li key={index}>{term}</li>
                ))}
              </ol>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.payment.title}</h2>
              <p className="text-gray-600 mb-4">{dict.distance_contract.payment.description}</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                {dict.distance_contract.payment.methods.map((method: any, index: number) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.delivery.title}</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                {dict.distance_contract.delivery.methods.map((method: any, index: number) => (
                  <li key={index}>{method}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.receiving.title}</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                {dict.distance_contract.receiving.conditions.map((condition: any, index: number) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.withdrawal.title}</h2>
              <p className="text-gray-600">{dict.distance_contract.withdrawal.description}</p>
              <div className="mt-6">
                <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{dict.distance_contract.withdrawal.conditions.title}</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  {dict.distance_contract.withdrawal.conditions.list.map((condition: any, index: number) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.distance_contract.contact.title}</h2>
              <p className="text-gray-600">{dict.distance_contract.contact.description}</p>
              <div className="mt-4 text-gray-600">
                <p>{dict.distance_contract.contact.email}: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                <p>{dict.distance_contract.contact.phone}: {process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
} 