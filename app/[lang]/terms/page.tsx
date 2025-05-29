import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Container } from '@/components/ui/container';
import Link from 'next/link';

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
        title: 'Terms of Service | Honey Farm',
        description: 'Terms and conditions for using our honey farm services.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.terms.meta.title,
      description: dict.terms.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Terms of Service | Honey Farm',
      description: 'Terms and conditions for using our honey farm services.',
    };
  }
}

export default async function TermsPage({
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
              <h1 className="text-4xl font-serif text-[#1D1D1F] mb-4">Terms of Service</h1>
              <p className="text-gray-600">Terms and conditions for using our honey farm services.</p>
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
            <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.terms.title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {new Date().toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.terms.general.title}</h2>
              <p className="text-gray-600">{dict.terms.general.description}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.terms.documents.title}</h2>
              <div className="grid gap-6">
                {dict.terms.documents.list.map((doc: any, index: number) => (
                  <div key={index} className="p-6 border border-[#FFE4D2] rounded-lg hover:border-[#FF7A3D] transition-colors">
                    <h3 className="text-2xl font-medium text-[#1D1D1F] mb-3">{doc.title}</h3>
                    <p className="text-gray-600 mb-4">{doc.description}</p>
                    <Link 
                      href={`/${lang}${doc.link}`}
                      className="text-[#FF7A3D] hover:text-[#ff6a2a] font-medium inline-flex items-center"
                    >
                      {dict.terms.readMore}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">{dict.terms.contact.title}</h2>
              <p className="text-gray-600">{dict.terms.contact.description}</p>
              <div className="mt-4 text-gray-600">
                <p>{dict.terms.contact.email}: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}</p>
                <p>{dict.terms.contact.phone}: {process.env.NEXT_PUBLIC_CONTACT_PHONE}</p>
                <p>{dict.terms.contact.address}: {process.env.NEXT_PUBLIC_CONTACT_ADDRESS}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Container>
  );
} 