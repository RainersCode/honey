import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import Image from 'next/image';
import Link from 'next/link';
import ProductCategories from '@/components/product-categories';
import ClientTestimonials from '@/components/client-testimonials';

const Homepage = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] w-full flex items-center rounded-xl overflow-hidden">
        <Image
          src="/images/hero-section/alternative-medicine-concept-ingredients-for-flu-2024-10-18-04-51-28-utc.jpg"
          alt="Natural honey ingredients and alternative medicine concept"
          fill
          className="object-cover brightness-[0.85] rounded-xl"
          priority
        />
        <div className="absolute inset-0 bg-black/30 rounded-xl" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Pure Natural Honey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Straight from our family farm to your table. Experience the authentic taste of nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="inline-block bg-[#FF7A3D] text-white px-8 py-4 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors text-lg"
            >
              Shop Our Honey
            </Link>
          </div>
        </div>
      </section>

      <ProductCategories />

      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} />

      {/* About Us Section */}
      <section className="relative w-full py-20">
        <div className="absolute inset-0 w-[99vw] left-[50%] translate-x-[-50%] bg-[#FFFBF8]" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-us/about us.jpg"
                alt="Our honey farm beehives in spring with blooming trees"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-serif text-[#1D1D1F]">Our Honey Farm</h2>
              <div className="w-20 h-1 bg-[#FF7A3D] rounded-full"></div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Nestled in the heart of nature, our honey farm is home to thriving bee colonies that produce some of the finest honey you'll ever taste. Our beehives are carefully placed in pristine locations, surrounded by blooming trees and wildflowers, ensuring our bees have access to the best nectar sources throughout the season.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We take pride in our sustainable beekeeping practices, maintaining the delicate balance between nature and tradition. Each hive is managed with care and respect, allowing our bees to thrive while producing pure, natural honey that captures the essence of our local flora.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-block bg-[#FF7A3D] text-white px-8 py-4 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors text-lg"
                >
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClientTestimonials />
    </>
  );
};

export default Homepage;
