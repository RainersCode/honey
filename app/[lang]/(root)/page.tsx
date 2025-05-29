import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import Image from 'next/image';
import Link from 'next/link';
import ProductCategoriesBento from '@/components/product-categories-bento';
import ClientTestimonials from '@/components/client-testimonials';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export default async function Homepage({ 
  params 
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang) as any;
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className='relative min-h-[600px] w-full flex items-center rounded-xl overflow-hidden'>
        <Image
          src='/images/hero-section/alternative-medicine-concept-ingredients-for-flu-2024-10-18-04-51-28-utc.jpg'
          alt='Natural honey ingredients and alternative medicine concept'
          fill
          className='object-cover brightness-[0.85] rounded-xl'
          priority
        />
        <div className='absolute inset-0 bg-black/30 rounded-xl' />
        <div className='relative z-10 max-w-7xl mx-auto px-4 py-20 text-center'>
          <h1 className='text-5xl md:text-7xl font-serif text-white mb-6'>
            {dict.home.hero.title}
          </h1>
          <p className='text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto'>
            {dict.home.hero.description}
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href={`/${lang}/search`}
              className='inline-block bg-[#FF7A3D] text-white px-8 py-4 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors text-lg'
            >
              {dict.home.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      <ProductCategoriesBento lang={lang} />

      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts as any} lang={lang} />
      )}

      <ProductList
        data={latestProducts as any}
        title={dict.home.latestArrivals}
        limit={4}
        lang={lang}
      />

      {/* About Us Section */}
      <section className='relative w-full py-20'>
        <div className='absolute inset-0 w-[99vw] left-[50%] translate-x-[-50%] bg-[#FFFBF8]' />
        <div className='relative max-w-7xl mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative h-[500px] rounded-2xl overflow-hidden shadow-lg'>
              <Image
                src='/images/about-us/about-us.jpg'
                alt={dict.home.about.imageAlt}
                fill
                className='object-cover hover:scale-105 transition-transform duration-700'
              />
            </div>
            <div className='space-y-6'>
              <h2 className='text-4xl font-serif text-[#1D1D1F]'>
                {dict.home.about.title}
              </h2>
              <div className='w-20 h-1 bg-[#FF7A3D] rounded-full'></div>
              <p className='text-gray-700 text-lg leading-relaxed'>
                {dict.home.about.description1}
              </p>
              <p className='text-gray-700 text-lg leading-relaxed'>
                {dict.home.about.description2}
              </p>
              <div className='pt-4'>
                <Link
                  href={`/${lang}/about`}
                  className='inline-block bg-[#FF7A3D] text-white px-8 py-4 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors text-lg'
                >
                  {dict.home.about.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientTestimonials lang={lang} />
    </>
  );
}
