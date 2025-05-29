import { MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';
import ContactForm from './contact-form';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

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
        title: 'Contact Us | Honey Farm',
        description: 'Get in touch with us for any questions about our natural honey products.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.contact.meta.title,
      description: dict.contact.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Contact Us | Honey Farm',
      description: 'Get in touch with us for any questions about our natural honey products.',
    };
  }
}

const ContactPage = async ({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#1D1D1F] mb-4">Contact Us</h1>
          <p className="text-gray-600">Get in touch with us for any questions about our natural honey products.</p>
        </div>
      </div>
    );
  }
  
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang) as any;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-[#1D1D1F] mb-4">{dict.contact.hero.title}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {dict.contact.hero.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8 p-6 bg-[#FFF9F5] rounded-2xl border border-[#FFE4D2]">
            <h2 className="text-2xl font-serif text-[#1D1D1F] mb-6">{dict.contact.info.title}</h2>
            
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-[#1D1D1F]">{dict.contact.info.address.label}</h3>
                <p className="text-gray-600">{dict.contact.info.address.value}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-[#1D1D1F]">{dict.contact.info.phone.label}</h3>
                <p className="text-gray-600">{dict.contact.info.phone.value}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-[#1D1D1F]">{dict.contact.info.email.label}</h3>
                <p className="text-gray-600">{dict.contact.info.email.value}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-[#FF7A3D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-[#1D1D1F]">{dict.contact.info.hours.label}</h3>
                <p className="text-gray-600">
                  {dict.contact.info.hours.weekdays}<br />
                  {dict.contact.info.hours.saturday}<br />
                  {dict.contact.info.hours.sunday}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#FFE4D2]">
              <h3 className="font-serif text-xl text-[#1D1D1F] mb-4">{dict.contact.requisites.title}</h3>
              <ul className="space-y-3">
                {dict.contact.requisites.items.map((item: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF7A3D] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm lang={lang} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 