import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from '@/components/shared/product/product-images';
import QuantityCartControl from '@/components/shared/product/quantity-cart-control';
import { getMyCart } from '@/lib/actions/cart.actions';
import ReviewList from './review-list';
import { auth } from '@/auth';
import Rating from '@/components/shared/product/rating';
import { Separator } from '@/components/ui/separator';
import { capitalizeWords } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth();
  const userId = session?.user?.id;

  const cart = await getMyCart();

  // Prepare breadcrumb items
  const breadcrumbItems = [
    {
      label: 'Products',
      href: '/search'
    },
    {
      label: capitalizeWords(product.category),
      href: `/search?category=${product.category}`
    },
    {
      label: product.name,
      href: `/product/${product.slug}`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mt-8 bg-white rounded-xl p-6 md:p-8 shadow-sm">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Images Column */}
          <div>
            <ProductImages images={product.images} />
          </div>

          {/* Details Column */}
          <div className='space-y-8'>
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-[#FF7A3D]/10 text-[#FF7A3D] hover:bg-[#FF7A3D]/20">
                  {capitalizeWords(product.category)}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1D1D1F] mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <Rating value={Number(product.rating)} />
                <span className="text-gray-500 text-sm">({product.numReviews} reviews)</span>
              </div>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-600">Price</span>
                <ProductPrice 
                  value={Number(product.price)} 
                  className="text-2xl font-medium text-[#1D1D1F]"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg text-gray-600">Status</span>
                {product.stock > 0 ? (
                  <Badge className="bg-green-50 text-green-700 hover:bg-green-100">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out Of Stock</Badge>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            {product.stock > 0 && (
              <div>
                <QuantityCartControl
                  cart={cart}
                  item={{
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    qty: 1,
                    image: product.images[0],
                  }}
                />
              </div>
            )}

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-[#1D1D1F]">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-[#1D1D1F] mb-2">Customer Reviews</h2>
          <div className="w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full"></div>
        </div>
        <ReviewList
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
          productRating={Number(product.rating) || 0}
          numReviews={Number(product.numReviews) || 0}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
