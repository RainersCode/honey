import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShoppingBasket,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  MapPin,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import UserButton from './user-button';
import CartCount from './cart-count';
import { APP_NAME } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionary';

interface MenuProps {
  lang: string;
}

const Menu = async ({ lang }: MenuProps) => {
  const dictionary = await getDictionary(lang);

  return (
    <div className='flex items-center gap-3'>
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 relative group'
      >
        <Link href={`/${lang}/cart`} className='flex items-center gap-2'>
          <div className='relative'>
            <ShoppingBasket className='h-5 w-5 stroke-[1.5] transition-transform duration-300 group-hover:scale-110' />
            <CartCount />
          </div>
          <span className='hidden sm:inline text-sm font-medium'>
            {dictionary.navigation?.cart || 'Cart'}
          </span>
        </Link>
      </Button>
      <UserButton lang={lang} />

      <nav className='sm:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='relative group p-2 hover:bg-transparent'
            >
              <div className='flex flex-col gap-[6px] items-end group-hover:gap-1 transition-all duration-300'>
                <span className='w-5 h-[2px] bg-[#1D1D1F] rounded-full group-hover:w-6 group-hover:bg-[#FF7A3D] transition-all duration-300'></span>
                <span className='w-4 h-[2px] bg-[#1D1D1F] rounded-full group-hover:w-5 group-hover:bg-[#FF7A3D] transition-all duration-300'></span>
                <span className='w-3 h-[2px] bg-[#1D1D1F] rounded-full group-hover:w-4 group-hover:bg-[#FF7A3D] transition-all duration-300'></span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className='bg-[#FFFBF8]/95 backdrop-blur-md border-l border-[#FFE4D2] flex flex-col'>
            <SheetClose className='absolute right-4 top-4 p-2 rounded-full group hover:bg-[#FFF5EE] transition-all duration-300'>
              <div className='relative w-5 h-5 transform group-hover:rotate-90 transition-all duration-300'>
                <span className='absolute top-1/2 left-0 w-5 h-[2px] bg-[#1D1D1F] rounded-full transform -translate-y-1/2 rotate-45 group-hover:bg-[#FF7A3D] transition-all duration-300'></span>
                <span className='absolute top-1/2 left-0 w-5 h-[2px] bg-[#1D1D1F] rounded-full transform -translate-y-1/2 -rotate-45 group-hover:bg-[#FF7A3D] transition-all duration-300'></span>
              </div>
            </SheetClose>

            <SheetHeader className='border-b border-[#FFE4D2] pb-4'>
              <SheetTitle className='text-[#1D1D1F] font-serif text-2xl'>
                {APP_NAME}
              </SheetTitle>
            </SheetHeader>

            <div className='flex-1 flex flex-col gap-4 mt-8'>
              <Button
                asChild
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1 font-medium'
              >
                <Link href={`/${lang}`}>
                  {dictionary.navigation?.home?.toUpperCase() || 'HOME'}
                </Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1 font-medium'
              >
                <Link href={`/${lang}/about`}>
                  {dictionary.navigation?.about?.toUpperCase() || 'ABOUT US'}
                </Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1 font-medium'
              >
                <Link href={`/${lang}/search`}>
                  {dictionary.navigation?.products?.toUpperCase() || 'PRODUCTS'}
                </Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1 font-medium'
              >
                <Link href={`/${lang}/contact`}>
                  {dictionary.navigation?.contact?.toUpperCase() || 'CONTACT'}
                </Link>
              </Button>
              <Button
                asChild
                variant='ghost'
                className='justify-start text-[#1D1D1F] hover:text-[#FF7A3D] transition-all duration-300 hover:translate-x-1 font-medium'
              >
                <Link
                  href={`/${lang}/cart`}
                  className='flex items-center gap-2 relative'
                >
                  <div className='relative'>
                    <ShoppingBasket className='h-5 w-5 stroke-[1.5]' />
                    <CartCount />
                  </div>
                  <span>
                    {dictionary.navigation?.cart?.toUpperCase() || 'CART'}
                  </span>
                </Link>
              </Button>
            </div>

            <SheetFooter className='mt-auto border-t border-[#FFE4D2] pt-6'>
              <div className='space-y-6'>
                {/* Contact Information */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium text-[#1D1D1F]'>
                    {dictionary.contact?.info?.title || 'Contact Us'}
                  </h3>
                  <div className='space-y-2'>
                    <a
                      href='tel:+1234567890'
                      className='flex items-center gap-2 text-sm text-[#1D1D1F] hover:text-[#FF7A3D] transition-colors'
                    >
                      <Phone className='h-4 w-4' />
                      <span>+1 (234) 567-890</span>
                    </a>
                    <a
                      href='mailto:info@honeyshop.com'
                      className='flex items-center gap-2 text-sm text-[#1D1D1F] hover:text-[#FF7A3D] transition-colors'
                    >
                      <Mail className='h-4 w-4' />
                      <span>info@honeyshop.com</span>
                    </a>
                    <div className='flex items-center gap-2 text-sm text-[#1D1D1F]'>
                      <MapPin className='h-4 w-4' />
                      <span>123 Honey Street, NY</span>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className='space-y-3'>
                  <h3 className='text-sm font-medium text-[#1D1D1F]'>
                    {dictionary.contact?.social?.title || 'Follow Us'}
                  </h3>
                  <div className='flex gap-4'>
                    <a
                      href='#'
                      className='bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] p-2 rounded-full text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-110'
                    >
                      <Facebook className='h-4 w-4' />
                    </a>
                    <a
                      href='#'
                      className='bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] p-2 rounded-full text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-110'
                    >
                      <Instagram className='h-4 w-4' />
                    </a>
                    <a
                      href='#'
                      className='bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] p-2 rounded-full text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-110'
                    >
                      <Twitter className='h-4 w-4' />
                    </a>
                  </div>
                </div>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
