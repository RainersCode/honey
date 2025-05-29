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
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.user.profile,
  };
};

const Profile = async ({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) => {
  const { lang } = await params;
  const session = await auth();
  const dict = await getDictionary(lang);

  return (
    <SessionProvider session={session}>
      <Container>
        <div className="py-10">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-2">
              <h2 className="h2-bold text-[#1D1D1F]">{dict.user.profile}</h2>
              <p className="text-muted-foreground">{dict.auth.signInDescription}</p>
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