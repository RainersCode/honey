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
import SignUpForm from './sign-up-form';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Account',
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/');
  }

  return (
    <div className="min-h-[calc(100vh-144px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-[2px] shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="space-y-6 pb-8 pt-6 border-b border-[#FFE4D2]">
            <Link href="/" className="flex justify-center">
              <Image
                src="/images/logo.svg"
                width={120}
                height={120}
                alt={`${APP_NAME} logo`}
                priority={true}
                className="hover:opacity-90 transition-opacity duration-200"
              />
            </Link>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-serif text-center text-[#1D1D1F]">Create Your Account</CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Join us and start shopping today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <SignUpForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
