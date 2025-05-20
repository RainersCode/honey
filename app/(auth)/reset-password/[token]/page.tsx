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

export const metadata: Metadata = {
  title: 'Reset Password',
};

interface Props {
  params: {
    token: string;
  };
}

export default async function ResetPasswordPage({ params }: Props) {
  // Redirect to home if user is already logged in
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  // Check if token exists and is not expired
  const user = await prisma.user.findFirst({
    where: {
      resetToken: params.token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  // If token is invalid or expired, redirect to forgot password
  if (!user) {
    redirect('/forgot-password?error=invalid-token');
  }

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>Reset Password</CardTitle>
          <CardDescription className='text-center'>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={params.token} />
        </CardContent>
      </Card>
    </div>
  );
} 