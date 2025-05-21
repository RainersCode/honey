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
import { UserIcon, Settings, Package, LogOut } from 'lucide-react';

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button 
        asChild
        size="sm"
        className="bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
      >
        <Link href='/sign-in' className="flex items-center gap-2">
          <UserIcon className="h-5 w-5 stroke-[1.5]" />
          <span className="text-sm font-medium">Sign In</span>
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? 'U';

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='relative w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] text-white hover:from-[#FF9A6A] hover:to-[#FF7A3D] transition-all duration-300 hover:scale-105'
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 bg-[#FFFBF8] border border-[#FFE4D2]' align='end' forceMount>
          <DropdownMenuLabel className='font-normal border-b border-[#FFE4D2] pb-2'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm font-medium text-[#1D1D1F]'>
                {session.user?.name}
              </p>
              <p className='text-xs text-gray-500'>
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <div className='p-1'>
            <DropdownMenuItem className='flex items-center gap-2 text-[#1D1D1F] hover:text-[#FF7A3D] hover:bg-[#FFF5EE] rounded-md transition-colors cursor-pointer'>
              <Settings className="h-4 w-4" />
              <Link href='/user/profile' className='w-full'>
                User Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='flex items-center gap-2 text-[#1D1D1F] hover:text-[#FF7A3D] hover:bg-[#FFF5EE] rounded-md transition-colors cursor-pointer'>
              <Package className="h-4 w-4" />
              <Link href='/user/orders' className='w-full'>
                Order History
              </Link>
            </DropdownMenuItem>

            {session?.user?.role === 'admin' && (
              <>
                <DropdownMenuSeparator className="bg-[#FFE4D2]" />
                <DropdownMenuItem className='flex items-center gap-2 text-[#1D1D1F] hover:text-[#FF7A3D] hover:bg-[#FFF5EE] rounded-md transition-colors cursor-pointer'>
                  <Settings className="h-4 w-4" />
                  <Link href='/admin/overview' className='w-full'>
                    Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-[#FFE4D2]" />
            <DropdownMenuItem className='flex items-center gap-2 text-[#1D1D1F] hover:text-[#FF7A3D] hover:bg-[#FFF5EE] rounded-md transition-colors cursor-pointer p-0'>
              <form action={signOutUser} className='w-full'>
                <Button
                  className='w-full h-8 justify-start gap-2 font-normal hover:bg-transparent hover:text-[#FF7A3D]'
                  variant='ghost'
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
