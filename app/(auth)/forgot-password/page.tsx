import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Metadata } from 'next';
import ForgotPasswordForm from './forgot-password-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default async function ForgotPasswordPage() {
  // Redirect to home if user is already logged in
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className='container flex h-screen w-screen flex-col items-center justify-center'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center'>Forgot Password</CardTitle>
          <CardDescription className='text-center'>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
} 