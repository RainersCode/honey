import ProductCard from './product-card';
import { Product } from '@/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ProductList = ({
  data,
  title,
  limit,
}: {
  data: Product[];
  title?: string;
  limit?: number;
}) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className='my-16'>
      <div className='text-center mb-10'>
        <h2 className='text-4xl font-serif text-[#1D1D1F] mb-2'>{title}</h2>
        <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
      </div>
      {data.length > 0 ? (
        <div className='relative'>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {limitedData.map((product: Product) => (
                <CarouselItem key={product.slug} className='pl-4 basis-full sm:basis-1/2 lg:basis-1/4'>
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='hidden md:flex -left-12' />
            <CarouselNext className='hidden md:flex -right-12' />
          </Carousel>
        </div>
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
