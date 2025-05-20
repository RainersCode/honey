import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Customer Profile',
};

const Profile = async () => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className='max-w-xl mx-auto'>
        <Card className='bg-[#FFFBF8] border-[#FFE4D2]'>
          <CardHeader className='space-y-1 flex flex-row items-center gap-2 border-b border-[#FFE4D2] bg-gradient-to-r from-[#FFF5EE] to-[#FFFBF8]'>
            <User className='h-5 w-5 text-[#FF7A3D]' />
            <CardTitle className='text-xl font-serif text-[#1D1D1F]'>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <ProfileForm />
          </CardContent>
        </Card>
      </div>
    </SessionProvider>
  );
};

export default Profile;
