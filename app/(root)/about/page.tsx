import Image from 'next/image';

export const metadata = {
  title: 'About Us | Honey Farm',
  description: 'Learn about our family-owned honey farm and our commitment to producing pure, natural honey products.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[400px] w-full">
        <Image
          src="/images/honey-farm-hero.jpg"
          alt="Honey Farm"
          fill
          className="object-cover brightness-[0.85]"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white text-center">
            Our Story
          </h1>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {/* Our Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-[#1D1D1F]">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At our family-owned honey farm, we're dedicated to producing the finest quality honey while maintaining sustainable beekeeping practices. For over two decades, we've been nurturing our bees and harvesting pure, natural honey that brings the authentic taste of nature to your table.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe in the importance of protecting our pollinators and promoting biodiversity. Every jar of honey represents our commitment to environmental stewardship and traditional beekeeping methods.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="/images/beekeeper.jpg"
              alt="Beekeeper tending to hives"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Our Process */}
        <section className="bg-white rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-serif text-[#1D1D1F] mb-8 text-center">Our Process</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src="/images/icons/bee.svg"
                  alt="Bee icon"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">Careful Cultivation</h3>
              <p className="text-gray-600">
                We carefully maintain our bee colonies, ensuring they have access to diverse flower sources.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src="/images/icons/honey.svg"
                  alt="Honey icon"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">Natural Harvesting</h3>
              <p className="text-gray-600">
                Our honey is harvested using traditional methods that preserve its natural properties.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FF7A3D] rounded-full flex items-center justify-center mx-auto">
                <Image
                  src="/images/icons/jar.svg"
                  alt="Jar icon"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="font-medium text-[#1D1D1F]">Quality Packaging</h3>
              <p className="text-gray-600">
                Each jar is carefully filled and sealed to maintain freshness and purity.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden order-2 md:order-1">
            <Image
              src="/images/honey-jars.jpg"
              alt="Honey jars in sunlight"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-serif text-[#1D1D1F]">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">Sustainability</h3>
                  <p className="text-gray-600">We practice sustainable beekeeping to protect our bees and environment.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">Quality</h3>
                  <p className="text-gray-600">Every product meets our strict standards for purity and taste.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#FF7A3D] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-[#1D1D1F] mb-2">Community</h3>
                  <p className="text-gray-600">We support local communities and educate about bee conservation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-serif text-[#1D1D1F] mb-6">
            Experience Nature's Sweetness
          </h2>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover our range of pure, natural honey products crafted with care and dedication.
          </p>
          <a
            href="/search"
            className="inline-block bg-[#FF7A3D] text-white px-8 py-3 rounded-full font-medium hover:bg-[#ff6a2a] transition-colors"
          >
            Shop Our Products
          </a>
        </section>
      </div>
    </>
  );
} 