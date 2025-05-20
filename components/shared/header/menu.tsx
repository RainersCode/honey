import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingBasket, Menu as MenuIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';
import CartCount from './cart-count';

const Menu = () => {
  return (
    <div className='flex items-center gap-3'>
      <Button 
        asChild 
        variant='ghost' 
        size='sm'
        className='text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 relative group'
      >
        <Link href='/cart' className='flex items-center gap-2'>
          <div className="relative">
            <ShoppingBasket className='h-5 w-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110' />
            <CartCount />
          </div>
          <span className='hidden sm:inline text-sm font-medium'>Cart</span>
        </Link>
      </Button>
      <UserButton />
      
      <nav className='sm:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant='ghost' 
              size='sm'
              className='text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300'
            >
              <MenuIcon className='h-5 w-5 stroke-[1.5] transition-transform duration-300 hover:scale-110' />
            </Button>
          </SheetTrigger>
          <SheetContent className='bg-[#FFFBF8]/95 backdrop-blur-md'>
            <SheetHeader>
              <SheetTitle className='text-[#1D1D1F] font-serif'>Menu</SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-4 mt-8'>
              <Button 
                asChild 
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1'
              >
                <Link href='/'>HOME</Link>
              </Button>
              <Button 
                asChild 
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1'
              >
                <Link href='/about'>ABOUT US</Link>
              </Button>
              <Button 
                asChild 
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1'
              >
                <Link href='/search'>PRODUCTS</Link>
              </Button>
              <Button 
                asChild 
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1'
              >
                <Link href='/contact'>CONTACT</Link>
              </Button>
              <Button 
                asChild 
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1'
              >
                <Link href='/cart' className='flex items-center gap-2 relative'>
                  <div className="relative">
                    <ShoppingBasket className='h-5 w-5 stroke-[1.5]' />
                    <CartCount />
                  </div>
                  <span>CART</span>
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
