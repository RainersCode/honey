import ProductCard from './product-card';
import { Product } from '@/types';
import ProductCarousel from './product-carousel-list';

const ProductList = async ({
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
        <ProductCarousel products={limitedData} />
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
