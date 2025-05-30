import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import { getAllProducts } from '@/lib/actions/product.actions';
import { getAllCategories } from '@/lib/actions/category.actions';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  ShoppingBag,
  Sparkles,
  Heart,
  Star,
  Gift,
  Crown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { capitalizeWords } from '@/lib/utils';
import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { BentoCard } from '@/components/ui/bento-grid';

// Icon mapping for different categories
const getCategoryIcon = (categoryKey: string) => {
  const iconMap: { [key: string]: any } = {
    electronics: Sparkles,
    clothing: ShoppingBag,
    home: Heart,
    beauty: Star,
    sports: Gift,
    accessories: Crown,
  };
  return iconMap[categoryKey] || ShoppingBag;
};

const sortOrders = [
  { key: 'newest', value: 'newest' },
  { key: 'lowestPrice', value: 'lowest' },
  { key: 'highestPrice', value: 'highest' },
];

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { lang } = await params;
  const { q = 'all', category = 'all' } = await searchParams;
  const dict = await getDictionary(lang);

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';

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
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const { lang } = await params;
  const {
    q = 'all',
    category = 'all',
    sort = 'newest',
    page = '1',
  } = await searchParams;
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

  // Prepare category cards with database categories for carousel
  const categoryCards = [
    {
      key: 'all',
      name: dict.products.categories.all.name,
      description: dict.products.categories.all.description,
      image:
        '/images/hero-section/alternative-medicine-concept-ingredients-for-flu-2024-10-18-04-51-28-utc.jpg',
      Icon: ShoppingBag,
    },
    ...categories.map((cat) => ({
      key: cat.key,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      Icon: getCategoryIcon(cat.key),
    })),
  ];

  // Prepare breadcrumb items
  const breadcrumbItems = [];
  if (category !== 'all') {
    const selectedCategory = categories.find((cat) => cat.key === category);
    breadcrumbItems.push({
      label: dict.navigation.products,
      href: `/${lang}/search`,
    });
    breadcrumbItems.push({
      label: selectedCategory
        ? selectedCategory.name
        : capitalizeWords(category),
      href: getFilterUrl({ c: category }),
    });
  } else {
    breadcrumbItems.push({
      label: dict.navigation.products,
      href: `/${lang}/search`,
    });
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <Breadcrumb items={breadcrumbItems} />

      {/* Category Carousel */}
      <section className='my-12'>
        <div className='mb-8 text-center'>
          <h2 className='text-3xl font-serif text-[#1D1D1F] mb-4'>
            Product Categories
          </h2>
          <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
        </div>

        <div className='relative'>
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-2 md:-ml-4'>
              {categoryCards.map((cat) => (
                <CarouselItem
                  key={cat.key}
                  className='pl-2 md:pl-4 basis-full sm:basis-[70%] md:basis-[50%] lg:basis-[33.333%]'
                >
                  <BentoCard
                    name={cat.name}
                    description={cat.description}
                    href={getFilterUrl({ c: cat.key })}
                    cta={dict.products.filters.viewProducts || 'View Products'}
                    background={
                      <div className='absolute inset-0 overflow-hidden'>
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className='object-cover transition-all duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-300' />
                      </div>
                    }
                    className={`h-[200px] ${
                      (cat.key === 'all' && category === 'all') ||
                      category === cat.key
                        ? 'ring-2 ring-[#FF7A3D]'
                        : ''
                    }`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 border-0 text-gray-300 hover:bg-[#FF7A3D] hover:text-white' />
            <CarouselNext className='absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/20 border-0 text-gray-300 hover:bg-[#FF7A3D] hover:text-white' />
          </Carousel>
        </div>
      </section>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Mobile Search & Sort */}
        <div className='lg:hidden space-y-4'>
          {/* Search Bar */}
          <form action={`/${lang}/search`} method='GET' className='flex gap-2'>
            <Input
              type='text'
              name='q'
              defaultValue={q !== 'all' ? q : ''}
              placeholder={dict.products.search.placeholder}
              className='flex-1'
            />
            <button
              type='submit'
              className='flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF7A3D] text-white hover:bg-[#FF7A3D]/90 transition-colors duration-200'
            >
              <SearchIcon className='h-5 w-5' />
            </button>
          </form>

          {/* Sort Options */}
          <div className='flex gap-2 overflow-x-auto pb-2'>
            {sortOrders.map((order) => (
              <Link
                key={order.value}
                href={getFilterUrl({ s: order.value })}
                className={`text-sm px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  sort === order.value
                    ? 'bg-[#FF7A3D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {
                  dict.products.sort[
                    order.key as keyof typeof dict.products.sort
                  ]
                }
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className='hidden lg:block w-64 flex-shrink-0'>
          <Card className='sticky top-4'>
            <CardContent className='p-6'>
              {/* Search */}
              <div className='space-y-3 mb-6'>
                <h3 className='font-serif text-xl text-[#1D1D1F]'>
                  {dict.common.search}
                </h3>
                <form
                  action={`/${lang}/search`}
                  method='GET'
                  className='flex gap-2'
                >
                  <Input
                    type='text'
                    name='q'
                    defaultValue={q !== 'all' ? q : ''}
                    placeholder={dict.products.search.placeholder}
                    className='flex-1'
                  />
                  <button
                    type='submit'
                    className='flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#FF7A3D]/10 transition-colors duration-200'
                  >
                    <SearchIcon className='h-5 w-5 text-[#FF7A3D]' />
                  </button>
                </form>
              </div>

              {/* Sort */}
              <div className='space-y-3'>
                <h3 className='font-serif text-xl text-[#1D1D1F]'>
                  {dict.products.sort.label}
                </h3>
                <div className='flex flex-col gap-2'>
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
                      {
                        dict.products.sort[
                          order.key as keyof typeof dict.products.sort
                        ]
                      }
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product grid */}
        <div className='flex-1'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} lang={lang} />
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-gray-500'>{dict.products.noResults}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
