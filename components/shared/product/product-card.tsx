import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';
import Rating from './rating';
import SimpleAddToCart from './simple-add-to-cart';
import { Locale } from '@/config/i18n.config';

interface ProductCardProps {
  product: Product;
  lang: Locale;
}

const ProductCard = ({ product, lang }: ProductCardProps) => {
  console.log('ProductCard:', JSON.stringify(product, null, 2));

  return (
    <Card className='w-full bg-white hover:shadow-lg transition-shadow duration-300 group relative overflow-hidden h-full'>
      <CardContent className='relative p-0'>
        <div className='relative h-[250px]'>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={true}
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
          {product.stock <= 5 && product.stock > 0 && (
            <div className='absolute top-2 right-2 bg-[#FF7A3D] text-white px-3 py-1 rounded-full text-xs font-medium z-10'>
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center z-10'>
              <span className='text-white text-lg font-medium'>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Link - covers only the image and title area */}
        <Link
          href={`/${lang}/product/${product.slug}`}
          className='absolute inset-0 z-[1] h-[calc(100%-60px)]'
        />

        <div className='p-4'>
          <div className='text-[#FF7A3D] font-medium mb-1 text-sm'>
            {product.brand}
          </div>
          <h2 className='font-serif text-base font-medium line-clamp-2 mb-2 text-[#1D1D1F] group-hover:text-[#FF7A3D] transition-colors duration-200'>
            {product.name}
          </h2>
          <div className='flex justify-between items-center gap-4 mt-auto mb-2'>
            <Rating value={Number(product.rating)} />
            {product.stock > 0 ? (
              <ProductPrice
                value={Number(product.price)}
                className='font-medium text-base text-[#1D1D1F]'
              />
            ) : (
              <p className='text-red-500 font-medium'>Out Of Stock</p>
            )}
          </div>
          {product.stock > 0 && (
            <div className='relative z-[2]'>
              <SimpleAddToCart
                item={{
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  qty: 1,
                  image: product.images[0],
                }}
                lang={lang}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
