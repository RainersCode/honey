import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { getAllCategories } from '@/lib/actions/category.actions';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

interface CategoryDrawerProps {
  lang: string;
}

const CategoryDrawer = async ({ lang }: CategoryDrawerProps) => {
  const categories = await getAllCategories();

  return (
    <Drawer direction='left'>
      <DrawerTrigger asChild>
        <Button variant='outline'>
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full max-w-sm'>
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className='space-y-1 mt-4'>
            {categories.map((category) => (
              <Button
                variant='ghost'
                className='w-full justify-start'
                key={category.id}
                asChild
              >
                <DrawerClose asChild>
                  <Link href={`/${lang}/search?category=${category.key}`}>
                    {category.name} ({category._count.products})
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default CategoryDrawer;
