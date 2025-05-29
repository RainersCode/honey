import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import CredentialsSignInForm from './credentials-signin-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = async (props: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { lang } = await props.params;
  const { callbackUrl } = await props.searchParams;
  const dict = await getDictionary(lang);

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || `/${lang}`);
  }

  return (
    <div className='min-h-[calc(100vh-144px)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md'>
        <Card className='bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300'>
          <CardHeader className='space-y-6 pb-8 pt-6 border-b border-[#FFE4D2]'>
            <Link href={`/${lang}`} className='flex justify-center'>
              <Image
                src='/images/logo.svg'
                width={120}
                height={120}
                alt={`${APP_NAME} logo`}
                priority={true}
                className='hover:opacity-90 transition-opacity duration-200'
              />
            </Link>
            <div className='space-y-2'>
              <CardTitle className='text-2xl font-serif text-center text-[#1D1D1F]'>
                {(dict as any).auth?.welcomeBack || 'Welcome Back'}
              </CardTitle>
              <CardDescription className='text-center text-muted-foreground'>
                {(dict as any).auth?.signInDescription ||
                  'Sign in to your account to continue'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='pt-8'>
            <CredentialsSignInForm lang={lang} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
