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
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems.map(item => ({
          ...item,
          label: capitalizeWords(item.label)
        }))} />
      </div>

      <div className='grid md:grid-cols-5 md:gap-8'>
        {/* Filters Sidebar */}
        <div className='md:col-span-1'>
          <Card className="bg-white/50 border-[#FF7A3D]/10">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-xl text-[#1D1D1F]">Search Products</CardTitle>
            </CardHeader>
            <CardContent>
              <form action='/search' method='GET' className='space-y-4'>
                <div className="space-y-2">
                  <Input
                    name='q'
                    type='text'
                    placeholder='Search honey products...'
                    defaultValue={q !== 'all' ? q : ''}
                    className='w-full bg-white/50 border-[#FF7A3D]/20 focus-visible:ring-[#FF7A3D]/20 placeholder:text-gray-400'
                  />
                  <Button 
                    type='submit' 
                    className='w-full bg-[#FF7A3D] hover:bg-[#ff6a2a] text-white transition-colors'
                  >
                    <SearchIcon className='h-4 w-4 mr-2' />
                    Search
                  </Button>
                </div>
              </form>

              <Separator className="my-4 bg-[#FF7A3D]/10" />

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

        <div className='md:col-span-4 space-y-6'>
          {/* Active Filters & Sort */}
          <Card className="bg-white/50 border-[#FF7A3D]/10">
            <CardContent className="pt-6">
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                {/* Active Filters */}
                <div className='flex flex-wrap items-center gap-2'>
                  {q !== 'all' && q !== '' && (
                    <Badge variant="secondary" className="bg-[#FF7A3D]/5 text-[#FF7A3D] hover:bg-[#FF7A3D]/10">
                      Search: {q}
                    </Badge>
                  )}
                  {category !== 'all' && category !== '' && (
                    <Badge variant="secondary" className="bg-[#FF7A3D]/5 text-[#FF7A3D] hover:bg-[#FF7A3D]/10">
                      Category: {capitalizeWords(category)}
                    </Badge>
                  )}
                  {(q !== 'all' && q !== '') ||
                  (category !== 'all' && category !== '') ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild 
                      className="text-[#FF7A3D] hover:text-[#ff6a2a] hover:bg-[#FF7A3D]/5"
                    >
                      <Link href='/search'>Clear All</Link>
                    </Button>
                  ) : null}
                </div>

                {/* Sort Options */}
                <div className='flex items-center gap-3'>
                  <span className='text-gray-600 text-sm'>Sort by:</span>
                  <div className='flex gap-2'>
                    {sortOrders.map((s) => (
                      <Link
                        key={s.value}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          sort === s.value 
                            ? 'bg-[#FF7A3D]/10 text-[#FF7A3D] font-medium' 
                            : 'hover:bg-[#FF7A3D]/5 text-gray-600'
                        }`}
                        href={getFilterUrl({ s: s.value })}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.data.length === 0 ? (
              <Card className="col-span-full border-[#FF7A3D]/10">
                <CardContent className="pt-6 text-center">
                  <p className='text-gray-600'>No products found</p>
                  <Button 
                    variant="link" 
                    asChild 
                    className="mt-2 text-[#FF7A3D] hover:text-[#ff6a2a]"
                  >
                    <Link href='/search'>Clear filters</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
