import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
  getAllCategories,
} from '@/lib/actions/product.actions';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import Image from 'next/image';

const sortOrders = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'lowest' },
  { label: 'Price: High to Low', value: 'highest' },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';

  if (isQuerySet || isCategorySet) {
    return {
      title: `
      ${isQuerySet ? `Search: ${q}` : ''} 
      ${isCategorySet ? `Category: ${category}` : ''}`,
    };
  } else {
    return {
      title: 'Our Products',
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    pg,
    query,
  }: {
    c?: string;
    s?: string;
    pg?: string;
    query?: string;
  }) => {
    const params = { q, category, sort, page };
    
    if (query !== undefined) params.q = query;
    if (c) params.category = c;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  // Category cards data
  const categoryCards = [
    {
      name: 'All Products',
      image: '/images/hero-section/alternative-medicine-concept-ingredients-for-flu-2024-10-18-04-51-28-utc.jpg',
      description: 'Browse our complete collection of natural honey products',
      category: 'all'
    },
    {
      name: 'Honey',
      image: '/images/categories/honey.jpg',
      description: 'Pure, natural honey with rich flavors and golden hues',
      category: 'honey'
    },
    {
      name: 'Beeswax',
      image: '/images/categories/beeswax.jpg',
      description: 'Natural beeswax products for home and wellness',
      category: 'beeswax'
    },
    {
      name: 'Honeycomb',
      image: '/images/categories/honeycomb.jpg',
      description: 'Fresh, raw honeycomb straight from the hive',
      category: 'honeycomb'
    }
  ];

  // Prepare breadcrumb items
  const breadcrumbItems = [];
  if (category !== 'all') {
    breadcrumbItems.push({
      label: 'Products',
      href: '/search'
    });
    breadcrumbItems.push({
      label: category,
      href: getFilterUrl({ c: category })
    });
  } else {
    breadcrumbItems.push({
      label: 'Products',
      href: '/search'
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {categoryCards.map((cat) => (
          <Link 
            href={getFilterUrl({ c: cat.category })}
            key={cat.name}
            className={`group relative overflow-hidden rounded-xl h-[200px] bg-[#FFFBF8] transition-transform duration-300 hover:-translate-y-1 ${
              (cat.category === 'all' && category === 'all') || category === cat.category 
                ? 'ring-2 ring-[#FF7A3D]' 
                : ''
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
            </div>
            <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
              <h3 className="text-2xl font-serif mb-2 text-white">{cat.name}</h3>
              <p className="text-white/90 text-sm mb-4">{cat.description}</p>
              <div className={`px-6 py-2 rounded-full text-sm font-medium text-white transition-all duration-300 ${
                (cat.category === 'all' && category === 'all') || category === cat.category
                  ? 'bg-[#FF7A3D] opacity-100' 
                  : 'bg-[#FF7A3D] opacity-0 group-hover:opacity-100'
              }`}>
                {(cat.category === 'all' && category === 'all') || category === cat.category 
                  ? 'Currently Viewing' 
                  : 'View Products'}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              {/* Search */}
              <div className="space-y-3 mb-6">
                <h3 className='font-serif text-xl text-[#1D1D1F]'>Search</h3>
                <form action="/search" method="GET" className="flex gap-2">
                  <Input
                    type="text"
                    name="q"
                    defaultValue={q !== 'all' ? q : ''}
                    placeholder="Search products..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <SearchIcon className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              <Separator className="my-6" />

              {/* Sort */}
              <div className="space-y-3 mb-6">
                <h3 className='font-serif text-xl text-[#1D1D1F]'>Sort By</h3>
                <div className='space-y-2'>
                  {sortOrders.map((x) => (
                    <Link
                      key={x.value}
                      className={`block py-2 px-3 rounded-lg transition-colors hover:bg-[#FF7A3D]/5 ${
                        sort === x.value 
                          ? 'bg-[#FF7A3D]/10 text-[#FF7A3D] font-medium' 
                          : 'text-gray-600'
                      }`}
                      href={getFilterUrl({ s: x.value })}
                    >
                      {x.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Categories */}
              <div className="space-y-3">
                <h3 className='font-serif text-xl text-[#1D1D1F]'>Categories</h3>
                <div className='space-y-2'>
                  <Link
                    className={`block py-2 px-3 rounded-lg transition-colors hover:bg-[#FF7A3D]/5 ${
                      (category === 'all' || category === '') 
                        ? 'bg-[#FF7A3D]/10 text-[#FF7A3D] font-medium' 
                        : 'text-gray-600'
                    }`}
                    href={getFilterUrl({ c: 'all' })}
                  >
                    All Products
                  </Link>
                  {categories.map((x) => (
                    <Link
                      key={x.category}
                      className={`block py-2 px-3 rounded-lg transition-colors hover:bg-[#FF7A3D]/5 ${
                        category === x.category 
                          ? 'bg-[#FF7A3D]/10 text-[#FF7A3D] font-medium' 
                          : 'text-gray-600'
                      }`}
                      href={getFilterUrl({ c: x.category })}
                    >
                      {capitalizeWords(x.category)}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
