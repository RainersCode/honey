import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';
import DealCountdown from '@/components/deal-countdown';
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
      <ClientTestimonials />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Homepage;
