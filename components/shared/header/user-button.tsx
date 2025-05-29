import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserIcon, Settings, Package, LogOut, ChevronDown } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

interface UserButtonProps {
  lang: Locale;
}

const UserButton = async ({ lang }: UserButtonProps) => {
  const session = await auth();
  const dictionary = await getDictionary(lang);

  if (!session) {
    return (
      <Button
        asChild
        size='sm'
        className='bg-gradient-to-r from-[#FF7A3D] to-[#FF9A6A] text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl border-0'
      >
        <Link href={`/${lang}/sign-in`} className='flex items-center gap-2'>
          <UserIcon className='h-4 w-4' />
          <span className='text-sm font-medium'>
            {dictionary.navigation?.login || 'Sign In'}
          </span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';
  const userEmail = session.user?.email || '';

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative flex items-center gap-2 h-10 px-3 py-2 rounded-full hover:bg-[#FFFBF8] border border-[#FFE4D2] hover:border-[#FF7A3D]/30 transition-all duration-300 hover:shadow-md group'
        >
          <div className='relative w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] flex items-center justify-center text-white text-sm font-semibold shadow-sm'>
            {firstInitial}
            <div className='absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </div>
          <ChevronDown className='h-3 w-3 text-[#1D1D1F]/60 group-hover:text-[#FF7A3D] transition-all duration-200 group-hover:scale-110 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#FF7A3D]' />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        className='w-64 bg-white border border-[#FFE4D2] shadow-xl rounded-xl p-2'
        align='end'
        sideOffset={5}
        forceMount
      >
        {/* User Info Section */}
        <DropdownMenuLabel className='p-3 border-b border-[#FFE4D2] mb-2'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] flex items-center justify-center text-white text-lg font-semibold shadow-sm'>
              {firstInitial}
            </div>
            <div className='flex flex-col min-w-0 flex-1'>
              <p className='text-sm font-semibold text-[#1D1D1F] truncate'>
                {session.user?.name}
              </p>
              <p className='text-xs text-[#1D1D1F]/60 truncate'>
                {userEmail}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Navigation Items */}
        <div className='space-y-1'>
          <Link href={`/${lang}/user/profile`}>
            <DropdownMenuItem className='flex items-center gap-3 px-3 py-2.5 text-[#1D1D1F] hover:bg-[#FFFBF8] hover:text-[#FF7A3D] rounded-lg transition-all duration-200 cursor-pointer group'>
              <div className='w-8 h-8 rounded-lg bg-[#FFFBF8] flex items-center justify-center group-hover:bg-[#FF7A3D]/10 transition-colors duration-200'>
                <Settings className='h-4 w-4' />
              </div>
              <span className='font-medium'>
                {dictionary.user?.profile || 'User Profile'}
              </span>
            </DropdownMenuItem>
          </Link>
          
          <Link href={`/${lang}/user/orders`}>
            <DropdownMenuItem className='flex items-center gap-3 px-3 py-2.5 text-[#1D1D1F] hover:bg-[#FFFBF8] hover:text-[#FF7A3D] rounded-lg transition-all duration-200 cursor-pointer group'>
              <div className='w-8 h-8 rounded-lg bg-[#FFFBF8] flex items-center justify-center group-hover:bg-[#FF7A3D]/10 transition-colors duration-200'>
                <Package className='h-4 w-4' />
              </div>
              <span className='font-medium'>
                {dictionary.user?.orders || 'Order History'}
              </span>
            </DropdownMenuItem>
          </Link>

          {/* Admin Section */}
          {session?.user?.role === 'admin' && (
            <>
              <DropdownMenuSeparator className='my-2 bg-[#FFE4D2]' />
              <Link href={`/${lang}/admin/overview`}>
                <DropdownMenuItem className='flex items-center gap-3 px-3 py-2.5 text-[#1D1D1F] hover:bg-[#FFFBF8] hover:text-[#FF7A3D] rounded-lg transition-all duration-200 cursor-pointer group'>
                  <div className='w-8 h-8 rounded-lg bg-[#FFFBF8] flex items-center justify-center group-hover:bg-[#FF7A3D]/10 transition-colors duration-200'>
                    <Settings className='h-4 w-4' />
                  </div>
                  <span className='font-medium'>
                    {dictionary.admin?.adminDashboard || 'Admin Dashboard'}
                  </span>
                </DropdownMenuItem>
              </Link>
            </>
          )}

          {/* Logout Section */}
          <DropdownMenuSeparator className='my-2 bg-[#FFE4D2]' />
          <form action={signOutUser}>
            <DropdownMenuItem className='flex items-center gap-3 px-3 py-2.5 text-[#1D1D1F] hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 cursor-pointer group p-0'>
              <Button
                type='submit'
                variant='ghost'
                className='w-full h-auto p-0 justify-start gap-3 font-normal hover:bg-transparent'
              >
                <div className='w-8 h-8 rounded-lg bg-[#FFFBF8] flex items-center justify-center group-hover:bg-red-100 transition-colors duration-200'>
                  <LogOut className='h-4 w-4' />
                </div>
                <span className='font-medium'>
                  {dictionary.navigation?.logout || 'Sign Out'}
                </span>
              </Button>
            </DropdownMenuItem>
          </form>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
