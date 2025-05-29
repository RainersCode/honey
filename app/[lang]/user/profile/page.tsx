import { Metadata } from 'next';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';
import ProfileForm from './profile-form';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';
import { Container } from '@/components/ui/container';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> => {
  try {
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.lang) {
      // Fallback metadata if params is not available during static generation
      return {
        title: 'Profile | Honey Farm',
      };
    }
    
    const { lang } = resolvedParams;
    const dict = await getDictionary(lang);
    return {
      title: (dict as any).user?.profile || 'Profile',
    };
  } catch (error) {
    // Fallback metadata if params is not available during static generation
    return {
      title: 'Profile | Honey Farm',
    };
  }
};

const Profile = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <Container>
        <div className="py-10">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-2">
              <h2 className="h2-bold text-[#1D1D1F]">Profile</h2>
              <p className="text-muted-foreground">Manage your profile information</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }
  
  const { lang } = resolvedParams;
  const session = await auth();
  const dict = await getDictionary(lang);

  return (
    <SessionProvider session={session}>
      <Container>
        <div className="py-10">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-2">
              <h2 className="h2-bold text-[#1D1D1F]">{(dict as any).user?.profile || 'Profile'}</h2>
              <p className="text-muted-foreground">{(dict as any).auth?.signInDescription || 'Sign in to your account to continue'}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-[#FFE4D2] p-6">
              <ProfileForm lang={lang} />
            </div>
          </div>
        </div>
      </Container>
    </SessionProvider>
  );
};

export default Profile; 