import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import ResetPasswordForm from './reset-password-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/db/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

export const metadata: Metadata = {
  title: 'Reset Password',
};

interface Props {
  params: Promise<{
    lang: Locale;
    token: string;
  }>;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { lang, token } = await params;
  const dict = await getDictionary(lang);

  // Redirect to home if user is already logged in
  const session = await auth();
  if (session?.user) {
    redirect(`/${lang}`);
  }

  // Check if token exists and is not expired
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  // If token is invalid or expired, redirect to forgot password
  if (!user) {
    redirect(`/${lang}/forgot-password?error=invalid-token`);
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
                {(dict as any).auth?.createNewPassword || 'Create New Password'}
              </CardTitle>
              <CardDescription className='text-center text-muted-foreground'>
                {(dict as any).auth?.createNewPasswordDescription ||
                  'Enter your new password below to reset your account'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='pt-8'>
            <ResetPasswordForm token={token} lang={lang} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
