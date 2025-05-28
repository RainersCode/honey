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
import { getDictionary } from '@/lib/dictionary';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Check Your Email',
};

const RegistrationSuccessPage = async (props: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ email?: string }>;
}) => {
  const { lang } = await props.params;
  const { email } = await props.searchParams;
  const dict = await getDictionary(lang);

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
                Registration Successful!
              </CardTitle>
              <CardDescription className='text-center text-muted-foreground'>
                Please check your email to verify your account
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='pt-8'>
            <div className='text-center space-y-6'>
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='w-20 h-20 bg-gradient-to-br from-[#FF7A3D] to-[#FF9A6A] rounded-full flex items-center justify-center'>
                    <Mail className='w-10 h-10 text-white' />
                  </div>
                  <div className='absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                    <CheckCircle className='w-5 h-5 text-white' />
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-medium text-[#1D1D1F]'>
                  Check Your Email
                </h3>
                <div className='space-y-2'>
                  <p className='text-muted-foreground'>
                    We've sent a verification email to:
                  </p>
                  {email && (
                    <p className='text-[#FF7A3D] font-medium break-all'>
                      {email}
                    </p>
                  )}
                </div>
                
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 text-left'>
                  <h4 className='font-medium text-blue-900 mb-2'>Next Steps:</h4>
                  <ul className='text-sm text-blue-800 space-y-1'>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-500 mt-0.5'>1.</span>
                      Check your email inbox (and spam folder)
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-500 mt-0.5'>2.</span>
                      Click the verification link in the email
                    </li>
                    <li className='flex items-start gap-2'>
                      <span className='text-blue-500 mt-0.5'>3.</span>
                      Return here to sign in to your account
                    </li>
                  </ul>
                </div>

                <div className='bg-amber-50 border border-amber-200 rounded-lg p-3'>
                  <p className='text-sm text-amber-800'>
                    <strong>Important:</strong> The verification link will expire in 24 hours.
                  </p>
                </div>
              </div>

              <div className='space-y-3 pt-4'>
                <Button 
                  asChild 
                  className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
                >
                  <Link href={`/${lang}/sign-in`}>
                    <ArrowRight className='w-5 h-5 mr-2' />
                    Go to Sign In
                  </Link>
                </Button>
                
                <p className='text-sm text-muted-foreground'>
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link 
                    href={`/${lang}/resend-verification`}
                    className='text-[#FF7A3D] hover:text-[#ff6a24] font-medium'
                  >
                    resend verification email
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationSuccessPage; 