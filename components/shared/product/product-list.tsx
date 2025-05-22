import ProductCard from './product-card';
import { Product } from '@/types';
import ProductCarousel from './product-carousel-list';
import { Locale } from '@/config/i18n.config';

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
  lang: Locale;
}

const ProductList = async ({
  data,
  title,
  limit,
  lang,
}: ProductListProps) => {
  const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <section className='my-16'>
      <div className='text-center mb-10'>
        <h2 className='text-4xl font-serif text-[#1D1D1F] mb-2'>{title}</h2>
        <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
      {data.length > 0 ? (
          <ProductCarousel products={limitedData} lang={lang} />
      ) : (
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
    </section>
  );
};

export default ProductList;
