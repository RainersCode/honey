'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resendVerificationEmailAction } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader, Mail } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

interface ResendVerificationFormProps {
  lang: Locale;
}

const ResendVerificationForm = ({ lang }: ResendVerificationFormProps) => {
  const [dict, setDict] = useState<any>(null);
  const [data, action] = useActionState(resendVerificationEmailAction, {
    success: false,
    message: '',
  });

  useEffect(() => {
    const loadDict = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    loadDict();
  }, [lang]);

  const ResendButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
      >
        {pending ? (
          <div className='flex items-center justify-center'>
            <Loader className='w-5 h-5 animate-spin mr-2' />
            <span>Sending...</span>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <Mail className='w-5 h-5 mr-2' />
            <span>Resend Verification Email</span>
          </div>
        )}
      </Button>
    );
  };

  if (!dict) {
    return <div>Loading...</div>;
  }

  return (
    <form action={action}>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-[#1D1D1F] font-medium'>
            Email Address
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder='Enter your email address'
          />
        </div>

        <div className='pt-2'>
          <ResendButton />
        </div>

        {data && (
          <div
            className={`text-center p-3 rounded-md ${
              data.success
                ? 'text-green-600 bg-green-50 border border-green-200'
                : 'text-red-600 bg-red-50 border border-red-200'
            }`}
          >
            {data.message}
          </div>
        )}

        <div className='text-center space-y-4 pt-4'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-[#FFE4D2]'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-muted-foreground'>
                Need help?
              </span>
            </div>
          </div>

          <div className='space-y-2'>
            <Link
              href={`/${lang}/sign-in`}
              className='block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
            >
              Back to Sign In
            </Link>
            <Link
              href={`/${lang}/sign-up`}
              className='block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ResendVerificationForm; 