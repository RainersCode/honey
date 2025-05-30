import Image from 'next/image';
import { getDictionary } from '@/lib/dictionary';
import { getAllCategories } from '@/lib/actions/category.actions';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Heart, Star, Gift, Crown } from 'lucide-react';
import { Locale } from '@/config/i18n.config';

interface ProductCategoriesBentoProps {
  lang: Locale;
}

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

// Grid layout patterns for different numbers of categories
const getGridLayout = (index: number, total: number) => {
  if (total <= 3) {
    return 'col-span-1 lg:col-span-1 lg:row-span-1';
  } else if (total === 4) {
    // Special layout for exactly 4 categories
    const layouts = [
      'col-span-1 lg:col-span-2 lg:row-span-2', // Large feature card (reduced height)
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card (top-right)
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card (middle-right, reduced height)
      'col-span-1 lg:col-span-3 lg:row-span-1', // Full width card at bottom
    ];
    return layouts[index];
  } else if (total === 5) {
    const layouts = [
      'col-span-1 lg:col-span-2 lg:row-span-2', // Large card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
      'col-span-1 lg:col-span-2 lg:row-span-1', // Wide card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
    ];
    return layouts[index] || 'col-span-1 lg:col-span-1 lg:row-span-1';
  } else {
    // For 6+ categories, create a more complex layout
    const layouts = [
      'col-span-1 lg:col-span-2 lg:row-span-2', // Large feature card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
      'col-span-1 lg:col-span-1 lg:row-span-2', // Tall card
      'col-span-1 lg:col-span-2 lg:row-span-1', // Wide card
      'col-span-1 lg:col-span-1 lg:row-span-1', // Small card
    ];
    return layouts[index % layouts.length];
  }
};

const ProductCategoriesBento = async ({
  lang,
}: ProductCategoriesBentoProps) => {
  const [dictionary, categories] = await Promise.all([
    getDictionary(lang),
    getAllCategories(),
  ]);

  const bentoFeatures = categories.map((category, index) => ({
    Icon: getCategoryIcon(category.key),
    name: category.name,
    description: category.description,
    href: `/${lang}/search?category=${category.key}`,
    cta: dictionary.productCategories?.shopNow || 'Shop Now',
    background: (
      <div className='absolute inset-0 overflow-hidden'>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className='object-cover transition-all duration-500 group-hover:scale-110'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 group-hover:from-black/30 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-300' />
      </div>
    ),
    className: getGridLayout(index, categories.length),
  }));

  return (
    <section className='my-20'>
      <div className='mb-12 max-w-7xl mx-auto px-4'>
        <div className='relative'>
          <div className='text-center'>
            <h2 className='text-4xl font-serif text-[#1D1D1F] mb-4'>
              {dictionary.productCategories?.title || 'Product Categories'}
            </h2>
            <div className='w-20 h-1 bg-[#FF7A3D] mx-auto rounded-full'></div>
          </div>
          <div className='absolute top-0 right-0 hidden sm:block'>
            <Link href={`/${lang}/search`}>
              <Button
                variant='outline'
                className='bg-white border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-colors duration-300'
              >
                {dictionary.products?.filters?.viewProducts || 'View Products'}
              </Button>
            </Link>
          </div>
          <div className='sm:hidden mt-4 text-center'>
            <Link href={`/${lang}/search`}>
              <Button
                variant='outline'
                className='bg-white border-[#FF7A3D] text-[#FF7A3D] hover:bg-[#FF7A3D] hover:text-white transition-colors duration-300'
              >
                {dictionary.products?.filters?.viewProducts || 'View Products'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-4'>
        <BentoGrid className='grid-cols-2 md:grid-cols-3'>
          {bentoFeatures.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

export default ProductCategoriesBento;
