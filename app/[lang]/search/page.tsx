import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllProducts,
} from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

const sortOrders = [
  { key: 'newest', value: 'newest' },
  { key: 'lowestPrice', value: 'lowest' },
  { key: 'highestPrice', value: 'highest' },
];

export async function generateMetadata({
  params,
  searchParams
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { lang } = await params;
  const { q = 'all', category = 'all' } = await searchParams;
  const dict = await getDictionary(lang);

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';

  if (isQuerySet || isCategorySet) {
    return {
      title: `
      ${isQuerySet ? dict.products.meta.searchTitle.replace('{query}', q) : ''} 
      ${isCategorySet ? dict.products.meta.categoryTitle.replace('{category}', category) : ''}`,
    };
  } else {
    return {
      title: dict.products.meta.title,
    };
  }
}

const SearchPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) => {
  const { lang } = await params;
  const { q = 'all', category = 'all', sort = 'newest', page = '1' } = await searchParams;
  const dict = await getDictionary(lang);

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

    return `/${lang}/search?${new URLSearchParams(params).toString()}`;
  };

  const { data: products } = await getAllProducts({
    query: q,
    category,
    sort,
    page: page ? Number(page) : 1,
  });

  console.log('Products:', JSON.stringify(products, null, 2));

  const categories = await getAllCategories();

  // Prepare category cards with database categories
  const categoryCards = [
    {
      key: 'all',
      name: dict.products.categories.all.name,
      description: dict.products.categories.all.description,
      image: '/images/hero-section/alternative-medicine-concept-ingredients-for-flu-2024-10-18-04-51-28-utc.jpg',
    },
    ...categories.map(cat => ({
      key: cat.key,
      name: cat.name,
      description: cat.description,
      image: cat.image,
    }))
  ];

  // Dynamic grid layout based on number of categories
  const getCategoryGridLayout = (count: number) => {
    if (count <= 3) {
      // 1-3 cards: single row
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8";
    } else if (count === 4) {
      // 4 cards: 2 rows with 2 cards each
      return "grid grid-cols-1 sm:grid-cols-2 gap-6 my-8";
    } else if (count === 5) {
      // 5 cards: 2 rows (3 on top, 2 on bottom)
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8";
    } else if (count === 6) {
      // 6 cards: 2 rows with 3 cards each
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8";
    } else if (count === 7) {
      // 7 cards: 2 rows (4 on top, 3 on bottom)
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8";
    } else if (count === 8) {
      // 8 cards: 2 rows with 4 cards each
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8";
    } else {
      // 9+ cards: 3 rows with 3 cards each (or similar balanced distribution)
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8";
    }
  };

  // Prepare breadcrumb items
  const breadcrumbItems = [];
  if (category !== 'all') {
    const selectedCategory = categories.find(cat => cat.key === category);
    breadcrumbItems.push({
      label: dict.navigation.products,
      href: `/${lang}/search`
    });
    breadcrumbItems.push({
      label: selectedCategory ? selectedCategory.name : capitalizeWords(category),
      href: getFilterUrl({ c: category })
    });
  } else {
    breadcrumbItems.push({
      label: dict.navigation.products,
      href: `/${lang}/search`
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Category Cards */}
      <div className={getCategoryGridLayout(categoryCards.length)}>
        {categoryCards.map((cat) => (
          <Link 
            href={getFilterUrl({ c: cat.key })}
            key={cat.key}
            className={`group relative overflow-hidden rounded-xl h-[120px] bg-[#FFFBF8] transition-transform duration-300 hover:-translate-y-1 ${
              (cat.key === 'all' && category === 'all') || category === cat.key 
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
            <div className="relative h-full flex flex-col justify-between p-6">
              {/* Button in top right - slides in from right on hover */}
              <div className="flex justify-end">
                <div className={`transform translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                  (cat.key === 'all' && category === 'all') || category === cat.key
                    ? 'translate-x-0 opacity-100' 
                    : ''
                }`}>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium text-white hover:text-black bg-[#FF7A3D] hover:bg-[#ff6a2a] transition-colors duration-300 shadow-lg ${
                    (cat.key === 'all' && category === 'all') || category === cat.key
                      ? '' 
                      : ''
                  }`}>
                    {(cat.key === 'all' && category === 'all') || category === cat.key 
                      ? dict.products.filters.currentlyViewing
                      : dict.products.filters.viewProducts}
                  </div>
                </div>
              </div>
              
              {/* Title in bottom left */}
              <div className="flex justify-start">
                <h3 className="text-2xl font-serif text-white">{cat.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Spacer line */}
      <div className="border-t border-[#FF7A3D]/30 my-8"></div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              {/* Search */}
              <div className="space-y-3 mb-6">
                <h3 className='font-serif text-xl text-[#1D1D1F]'>{dict.common.search}</h3>
                <form action={`/${lang}/search`} method="GET" className="flex gap-2">
                  <Input
                    type="text"
                    name="q"
                    defaultValue={q !== 'all' ? q : ''}
                    placeholder={dict.products.search.placeholder}
                    className="flex-1"
                  />
                  <button type="submit" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#FF7A3D]/10 transition-colors duration-200">
                    <SearchIcon className="h-5 w-5 text-[#FF7A3D]" />
                  </button>
                </form>
              </div>

              {/* Sort */}
              <div className="space-y-3">
                <h3 className='font-serif text-xl text-[#1D1D1F]'>{dict.products.sort.label}</h3>
                <div className="flex flex-col gap-2">
                  {sortOrders.map((order) => (
                    <Link
                      key={order.value}
                      href={getFilterUrl({ s: order.value })}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                        sort === order.value
                          ? 'bg-[#FF7A3D] text-white'
                          : 'hover:bg-[#FF7A3D]/10'
                      }`}
                    >
                      {dict.products.sort[order.key as keyof typeof dict.products.sort]}
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
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{dict.products.noResults}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;