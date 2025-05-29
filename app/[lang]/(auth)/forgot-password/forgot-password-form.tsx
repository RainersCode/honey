'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { requestPasswordReset } from '@/lib/actions/password-reset.actions';
import { Loader, Mail } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

interface ForgotPasswordFormProps {
  lang: Locale;
}

const ForgotPasswordForm = ({ lang }: ForgotPasswordFormProps) => {
  const [dict, setDict] = useState<any>(null);
  const [data, action] = useActionState(requestPasswordReset, {
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

  const ResetButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
      >
        {pending ? (
          <div className='flex items-center justify-center'>
            <Loader className='w-5 h-5 animate-spin mr-2' />
            <span>
              {dict?.auth?.sendingResetLink || 'Sending Reset Link...'}
            </span>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <Mail className='w-5 h-5 mr-2' />
            <span>{dict?.auth?.sendResetLink || 'Send Reset Link'}</span>
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
            {dict.auth?.emailAddress || 'Email Address'}
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={dict.auth?.enterEmail || 'Enter your email'}
          />
        </div>

        <div className='pt-2'>
          <ResetButton />
        </div>

        {data && (
          <div
            className={`text-center p-3 rounded-md ${
              data.success
                ? 'text-green-600 bg-green-50'
                : 'text-red-600 bg-red-50'
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
                {dict.auth?.rememberPassword || 'Remember your password?'}
              </span>
            </div>
          </div>

          <Link
            href={`/${lang}/sign-in`}
            className='inline-block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
          >
            {dict.auth?.backToSignIn || 'Back to Sign In'}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
