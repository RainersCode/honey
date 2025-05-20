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

const capitalizeWords = (str: string) => {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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
        <div className='md:col-span-1 bg-white/50 p-6 rounded-xl border border-amber-100'>
          <div className='space-y-6'>
            {/* Search */}
            <div>
              <h3 className='text-xl font-serif mb-4'>Search</h3>
              <form action='/search' method='GET' className='space-y-2'>
                <Input
                  name='q'
                  type='text'
                  placeholder='Search products...'
                  defaultValue={q !== 'all' ? q : ''}
                  className='w-full bg-white/50 border-amber-200 focus-visible:ring-amber-200'
                />
                <Button type='submit' className='w-full bg-amber-600 hover:bg-amber-700'>
                  <SearchIcon className='h-4 w-4 mr-2' />
                  Search
                </Button>
              </form>
            </div>

            <Separator className="bg-amber-100" />

            {/* Category Filter */}
            <div>
              <h3 className='text-xl font-serif mb-4'>Categories</h3>
              <ul className='space-y-3'>
                <li>
                  <Link
                    className={`block transition-colors hover:text-amber-600 text-lg ${
                      (category === 'all' || category === '') ? 'text-amber-600 font-medium' : 'text-gray-600'
                    }`}
                    href={getFilterUrl({ c: 'all' })}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((x) => (
                  <li key={x.category}>
                    <Link
                      className={`block transition-colors hover:text-amber-600 text-lg ${
                        category === x.category ? 'text-amber-600 font-medium' : 'text-gray-600'
                      }`}
                      href={getFilterUrl({ c: x.category })}
                    >
                      {capitalizeWords(x.category)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className='md:col-span-4 space-y-6'>
          {/* Active Filters & Sort */}
          <div className='bg-white/50 p-4 rounded-xl border border-amber-100'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              {/* Active Filters */}
              <div className='flex flex-wrap items-center gap-2'>
                {q !== 'all' && q !== '' && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                    Search: {q}
                  </Badge>
                )}
                {category !== 'all' && category !== '' && (
                  <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                    Category: {capitalizeWords(category)}
                  </Badge>
                )}
                {(q !== 'all' && q !== '') ||
                (category !== 'all' && category !== '') ? (
                  <Button variant="ghost" size="sm" asChild className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                    <Link href='/search'>Clear All</Link>
                  </Button>
                ) : null}
              </div>

              {/* Sort Options */}
              <div className='flex items-center gap-2 text-sm'>
                <span className='text-gray-600'>Sort by:</span>
                <div className='flex gap-2'>
                  {sortOrders.map((s) => (
                    <Link
                      key={s.value}
                      className={`px-3 py-1 rounded-full transition-colors ${
                        sort === s.value 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'hover:bg-amber-50 text-gray-600'
                      }`}
                      href={getFilterUrl({ s: s.value })}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.data.length === 0 ? (
              <div className='col-span-full text-center py-8'>
                <p className='text-gray-600'>No products found</p>
                <Button variant="link" asChild className="mt-2 text-amber-600">
                  <Link href='/search'>Clear filters</Link>
                </Button>
              </div>
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
