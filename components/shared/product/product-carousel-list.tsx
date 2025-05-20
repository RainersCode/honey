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

const ProductCarousel = ({ products }: { products: Product[] }) => {
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
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='hidden md:flex -left-12' />
        <CarouselNext className='hidden md:flex -right-12' />
      </Carousel>
    </div>
  );
};

export default ProductCarousel; 