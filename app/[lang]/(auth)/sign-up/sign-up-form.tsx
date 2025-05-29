'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { Loader, UserPlus } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

interface SignUpFormProps {
  lang: Locale;
}

const SignUpForm = ({ lang }: SignUpFormProps) => {
  const [dict, setDict] = useState<any>(null);
  const [data, action] = useActionState(signUpUser, {
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

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button
        disabled={pending}
        className='w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12'
      >
        {pending ? (
          <div className='flex items-center justify-center'>
            <Loader className='w-5 h-5 animate-spin mr-2' />
            <span>{dict?.auth?.creatingAccount || 'Creating Account...'}</span>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <UserPlus className='w-5 h-5 mr-2' />
            <span>{dict?.auth?.createAccount || 'Create Account'}</span>
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
          <Label htmlFor='name' className='text-[#1D1D1F] font-medium'>
            {dict.auth?.fullName || 'Full Name'}
          </Label>
          <Input
            id='name'
            name='name'
            type='text'
            required
            autoComplete='name'
            defaultValue={signUpDefaultValues.name}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={dict.auth?.enterFullName || 'Enter your full name'}
          />
        </div>
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
            defaultValue={signUpDefaultValues.email}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={dict.auth?.enterEmail || 'Enter your email'}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-[#1D1D1F] font-medium'>
            {dict.auth?.passwordLabel || 'Create Password'}
          </Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='new-password'
            defaultValue={signUpDefaultValues.password}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={
              dict.auth?.passwordPlaceholder || 'Enter a secure password'
            }
          />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='confirmPassword'
            className='text-[#1D1D1F] font-medium'
          >
            {dict.auth?.confirmPasswordLabel || 'Confirm Password'}
          </Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            autoComplete='new-password'
            defaultValue={signUpDefaultValues.confirmPassword}
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={
              dict.auth?.confirmPasswordPlaceholder || 'Re-enter your password'
            }
          />
        </div>

        <div className='pt-2'>
          <SignUpButton />
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
                {dict.auth?.alreadyHaveAccount || 'Already have an account?'}
              </span>
            </div>
          </div>

          <Link
            href={`/${lang}/sign-in`}
            className='inline-block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
          >
            {dict.auth?.signInInstead || 'Sign In Instead'}
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
