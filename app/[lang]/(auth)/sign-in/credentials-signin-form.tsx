'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { Loader, LogIn } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

interface CredentialsSignInFormProps {
  lang: string;
}

const CredentialsSignInForm = ({ lang }: CredentialsSignInFormProps) => {
  const [dict, setDict] = useState<any>(null);
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || `/${lang}`;

  useEffect(() => {
    const loadDict = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    loadDict();
  }, [lang]);

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
      >
        {pending ? (
          <div className='flex items-center justify-center'>
            <Loader className='w-5 h-5 animate-spin mr-2' />
            <span>{dict?.auth?.signingIn || 'Signing In...'}</span>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <LogIn className='w-5 h-5 mr-2' />
            <span>{dict?.auth?.signIn || 'Sign In'}</span>
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
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
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
            defaultValue={signInDefaultValues.email}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={dict.auth?.enterEmail || 'Enter your email'}
          />
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between items-center'>
            <Label htmlFor='password' className='text-[#1D1D1F] font-medium'>
              {dict.auth?.passwordLabel || 'Password'}
            </Label>
            <Link
              href={`/${lang}/forgot-password`}
              className='text-sm text-[#FF7A3D] hover:text-[#ff6a24] transition-colors duration-200'
            >
              {dict.auth?.forgotPassword || 'Forgot password?'}
            </Link>
          </div>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='current-password'
            defaultValue={signInDefaultValues.password}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={
              dict.auth?.passwordPlaceholder || 'Enter a secure password'
            }
          />
        </div>

        <div className='pt-2'>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className='text-center text-red-600 bg-red-50 p-3 rounded-md'>
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
                {dict.auth?.dontHaveAccount || "Don't have an account?"}
              </span>
            </div>
          </div>

          <Link
            href={`/${lang}/sign-up`}
            className='inline-block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
          >
            {dict.auth?.createAccount || 'Create an Account'}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
