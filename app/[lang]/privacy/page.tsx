import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Container } from '@/components/ui/container';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return {
    title: dict.privacy.meta.title,
    description: dict.privacy.meta.description,
  };
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;

  return (
    <Container>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.privacy.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.policy.title}</h2>
              <p className="text-gray-600">{dict.privacy.policy.description}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.orders.title}</h2>
              <p className="text-gray-600">{dict.privacy.orders.description1}</p>
              <p className="text-gray-600 mt-4">{dict.privacy.orders.description2}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.data.title}</h2>
              <p className="text-gray-600">{dict.privacy.data.description1}</p>
              <p className="text-gray-600 mt-4">{dict.privacy.data.description2}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.rights.title}</h2>
              <p className="text-gray-600">{dict.privacy.rights.description}</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                {dict.privacy.rights.list.map((item: { title: string; description: string }, index: number) => (
                  <li key={index}><strong>{item.title}</strong> - {item.description}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.cookies.title}</h2>
              <p className="text-gray-600">{dict.privacy.cookies.description}</p>
              
              <h3 className="text-2xl font-medium text-[#1D1D1F] mt-6 mb-4">{dict.privacy.cookies.what.title}</h3>
              <p className="text-gray-600">{dict.privacy.cookies.what.description}</p>

              <h3 className="text-2xl font-medium text-[#1D1D1F] mt-6 mb-4">{dict.privacy.cookies.types.title}</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
                {dict.privacy.cookies.types.list.map((item: { title: string; description: string }, index: number) => (
                  <li key={index}><strong>{item.title}</strong> - {item.description}</li>
                ))}
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.control.title}</h2>
              <p className="text-gray-600">{dict.privacy.control.description}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.privacy.contact.title}</h2>
              <p className="text-gray-600">{dict.privacy.contact.description}</p>
              <div className="mt-4 text-gray-600">
                <p>{dict.privacy.contact.email}: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                <p>{dict.privacy.contact.phone}: {process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
                <p>{dict.privacy.contact.address}: {process.env.NEXT_PUBLIC_CONTACT_ADDRESS}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
} 