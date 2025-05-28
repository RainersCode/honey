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
import { verifyEmail } from '@/lib/actions/user.actions';
import { getDictionary } from '@/lib/dictionary';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Email Verification',
};

const VerifyEmailPage = async (props: {
  params: Promise<{ lang: string; token: string }>;
}) => {
  const { lang, token } = await props.params;
  const dict = await getDictionary(lang);

  // Verify the email token
  const result = await verifyEmail(token);

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
                Email Verification
              </CardTitle>
              <CardDescription className='text-center text-muted-foreground'>
                {result.success 
                  ? 'Your email has been verified!' 
                  : 'There was an issue with your verification'
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className='pt-8'>
            <div className='text-center space-y-6'>
              {result.success ? (
                <>
                  <div className='flex justify-center'>
                    <CheckCircle className='w-16 h-16 text-green-500' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-medium text-[#1D1D1F]'>
                      Verification Successful!
                    </h3>
                    <p className='text-muted-foreground'>
                      {result.message}
                    </p>
                  </div>
                  <div className='space-y-4'>
                    <Button 
                      asChild 
                      className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
                    >
                      <Link href={`/${lang}/sign-in`}>
                        Sign In to Your Account
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex justify-center'>
                    <XCircle className='w-16 h-16 text-red-500' />
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-medium text-[#1D1D1F]'>
                      Verification Failed
                    </h3>
                    <p className='text-muted-foreground'>
                      {result.message}
                    </p>
                  </div>
                  <div className='space-y-4'>
                    <Button 
                      asChild 
                      className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
                    >
                      <Link href={`/${lang}/sign-up`}>
                        <Mail className='w-5 h-5 mr-2' />
                        Try Again
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant='outline'
                      className='w-full border-[#FFE4D2] hover:bg-[#FFF8F3] text-[#1D1D1F] font-medium h-12'
                    >
                      <Link href={`/${lang}/sign-in`}>
                        Sign In Instead
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage; 