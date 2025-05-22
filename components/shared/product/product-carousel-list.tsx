'use client';

import { Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './product-card';
import { Locale } from '@/config/i18n.config';

interface ProductCarouselProps {
  products: Product[];
  lang: Locale;
}

const ProductCarousel = ({ products, lang }: ProductCarouselProps) => {
  return (
    <div className='relative'>
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-4'>
          {products.map((product: Product) => (
            <CarouselItem key={product.slug} className='pl-4 basis-full sm:basis-1/2 lg:basis-1/4'>
              <ProductCard product={product} lang={lang} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='hidden md:flex -left-4' />
        <CarouselNext className='hidden md:flex -right-4' />
      </Carousel>
    </div>
  );
};

export default ProductCarousel; 