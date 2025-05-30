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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className='relative overflow-hidden pb-12'>
      <Carousel
        opts={{
          align: 'center',
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        className='w-full'
        setApi={setApi}
      >
        <CarouselContent className='ml-0'>
          {products.map((product: Product, index: number) => {
            const isCenter = index === current;
            const isAdjacent =
              Math.abs(index - current) === 1 ||
              (current === 0 && index === products.length - 1) ||
              (current === products.length - 1 && index === 0);

            return (
              <CarouselItem
                key={product.slug}
                className='pl-0 basis-[85%] sm:basis-[70%] md:basis-[60%] lg:basis-[45%] xl:basis-[40%]'
              >
                <div className='px-2 sm:px-4 md:px-6 py-4'>
                  <div
                    className={`transition-all duration-500 hover:scale-105 ${
                      isCenter
                        ? 'scale-100'
                        : isAdjacent
                          ? 'scale-90 opacity-70'
                          : 'scale-85 opacity-50'
                    }`}
                  >
                    <div
                      className={`transition-all duration-500 ${
                        isCenter ? 'transform-none' : 'transform scale-y-90'
                      }`}
                    >
                      <ProductCard product={product} lang={lang} />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation arrows - hidden on mobile */}
        <div className='hidden md:flex justify-center mt-6 space-x-2'>
          <CarouselPrevious className='relative translate-x-0 translate-y-0 h-10 w-10 bg-white border-2 border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white' />
          <CarouselNext className='relative translate-x-0 translate-y-0 h-10 w-10 bg-white border-2 border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white' />
        </div>

        {/* Dot indicators for mobile */}
        <div className='flex md:hidden justify-center mt-4 space-x-2 pb-4'>
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-[#FF7A3D] scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Fade gradients for better visual indication */}
      <div className='absolute left-0 top-0 bottom-12 w-8 sm:w-16 bg-gradient-to-r from-white/60 via-white/40 to-transparent pointer-events-none z-10' />
      <div className='absolute right-0 top-0 bottom-12 w-8 sm:w-16 bg-gradient-to-l from-white/60 via-white/40 to-transparent pointer-events-none z-10' />
    </div>
  );
};

export default ProductCarousel;
