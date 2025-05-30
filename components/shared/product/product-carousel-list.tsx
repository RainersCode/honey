'use client';

import { Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import ProductCard from './product-card';
import { Locale } from '@/config/i18n.config';
import { useEffect, useState } from 'react';

interface ProductCarouselProps {
  products: Product[];
  lang: Locale;
}

const ProductCarousel = ({ products, lang }: ProductCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateState();
    api.on('select', updateState);
    api.on('init', updateState);

    return () => {
      api.off('select', updateState);
      api.off('init', updateState);
    };
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <div className='relative w-full px-4 max-w-7xl mx-auto'>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
          skipSnaps: false,
          dragFree: false,
        }}
        className='w-full'
        setApi={setApi}
      >
        <CarouselContent className='space-x-4 md:space-x-6'>
          {products.map((product: Product, index: number) => (
            <CarouselItem
              key={product.slug}
              className='basis-[280px] md:basis-[320px] lg:basis-[350px] flex-shrink-0'
            >
              <div className='h-full transform transition-transform duration-200 hover:scale-[1.02]'>
                <ProductCard product={product} lang={lang} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Desktop Navigation */}
        <div className='hidden md:block'>
          <CarouselPrevious
            className={`absolute -left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white shadow-lg border-0 text-gray-600 hover:bg-[#FF7A3D] hover:text-white transition-all duration-200 ${
              !canScrollPrev ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canScrollPrev}
          />
          <CarouselNext
            className={`absolute -right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white shadow-lg border-0 text-gray-600 hover:bg-[#FF7A3D] hover:text-white transition-all duration-200 ${
              !canScrollNext ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!canScrollNext}
          />
        </div>
      </Carousel>

      {/* Mobile/Tablet Dots */}
      <div className='flex md:hidden justify-center mt-6 space-x-2'>
        {Array.from({ length: Math.max(1, products.length - 2) }).map(
          (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current
                  ? 'bg-[#FF7A3D] w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        )}
      </div>

      {/* Desktop Dots */}
      <div className='hidden md:flex justify-center mt-8 space-x-3'>
        {Array.from({ length: Math.max(1, products.length - 3) }).map(
          (_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === current
                  ? 'bg-[#FF7A3D] scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
