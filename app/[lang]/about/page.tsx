import Image from 'next/image';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Locale }> 
}) {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.lang) {
      // Fallback metadata if params is not available during static generation
      return {
        title: 'About Us | Honey Farm',
        description: 'Learn about our natural honey products and sustainable farming practices.',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang) as any;

    return {
      title: dict.about.meta.title,
      description: dict.about.meta.description,
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'About Us | Honey Farm',
      description: 'Learn about our natural honey products and sustainable farming practices.',
    };
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  const dict = await getDictionary(lang) as any;

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] w-full rounded-xl overflow-hidden">
        <Image
          src={`/images/about-us/about-us.jpg`}
          alt={dict.about.hero.imageAlt}
          width={1920}
          height={1080}
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/30 rounded-xl" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white text-center">
            {dict.about.hero.title}
          </h1>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Our Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-[#1D1D1F]">{dict.about.mission.title}</h2>
            <p className="text-gray-700 leading-relaxed">
              {dict.about.mission.description1}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {dict.about.mission.description2}
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src={`/images/about-us/beekeeper.jpg`}
              alt={dict.about.mission.imageAlt}
              width={1200}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
        </section>

        {/* Our Process */}
        <section className="bg-white rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-serif text-[#1D1D1F] mb-8 text-center">{dict.about.process.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src={`/images/icons/bee.svg`}
                  alt={dict.about.process.step1.iconAlt}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">{dict.about.process.step1.title}</h3>
              <p className="text-gray-600">{dict.about.process.step1.description}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src={`/images/icons/honey.svg`}
                  alt={dict.about.process.step2.iconAlt}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">{dict.about.process.step2.title}</h3>
              <p className="text-gray-600">{dict.about.process.step2.description}</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src={`/images/icons/jar.svg`}
                  alt={dict.about.process.step3.iconAlt}
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">{dict.about.process.step3.title}</h3>
              <p className="text-gray-600">{dict.about.process.step3.description}</p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden order-2 md:order-1">
            <Image
              src={`/images/about-us/honey-jar.jpg`}
              alt={dict.about.values.imageAlt}
              width={1200}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-serif text-[#1D1D1F]">{dict.about.values.title}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">{dict.about.values.value1.title}</h3>
                  <p className="text-gray-600">{dict.about.values.value1.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">{dict.about.values.value2.title}</h3>
                  <p className="text-gray-600">{dict.about.values.value2.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">{dict.about.values.value3.title}</h3>
                  <p className="text-gray-600">{dict.about.values.value3.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">
            {dict.about.cta.title}
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            {dict.about.cta.description}
          </p>
          <Link
            href={`/${lang}/search`}
            className="inline-block bg-[#FF7A3D] text-white px-8 py-3 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors"
          >
            {dict.about.cta.button}
          </Link>
        </section>
      </div>
    </>
  );
} 