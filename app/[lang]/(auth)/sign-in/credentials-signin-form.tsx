'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithCredentials, resendVerificationEmailAction } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, Loader, Mail } from 'lucide-react';
import { getDictionary } from '@/lib/dictionary';

interface CredentialsSignInFormProps {
  lang: string;
}

const CredentialsSignInForm = ({ lang }: CredentialsSignInFormProps) => {
  const [dict, setDict] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [lastEmailAttempt, setLastEmailAttempt] = useState('');
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });
  const [resendData, resendAction] = useActionState(resendVerificationEmailAction, {
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

  // Check if the error might be due to unverified email
  useEffect(() => {
    if (data && !data.success && data.message === 'Invalid email or password') {
      // Show resend option if user just tried to sign in
      setShowResendOption(true);
    }
  }, [data]);

  const handleResendVerification = () => {
    if (lastEmailAttempt) {
      const formData = new FormData();
      formData.append('email', lastEmailAttempt);
      resendAction(formData);
    }
  };

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
    <form action={(formData) => {
      setLastEmailAttempt(formData.get('email') as string);
      setShowResendOption(false);
      action(formData);
    }}>
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
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={dict.auth?.enterEmail || 'Enter your email'}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-[#1D1D1F] font-medium'>
            {dict.auth?.password || 'Password'}
          </Label>
          <div className='relative'>
            <Input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete='current-password'
              className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50 pr-12'
              placeholder={dict.auth?.enterPassword || 'Enter your password'}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#FF7A3D] transition-colors'
            >
              {showPassword ? (
                <EyeOff className='w-5 h-5' />
              ) : (
                <Eye className='w-5 h-5' />
              )}
            </button>
          </div>
        </div>

        <div className='flex justify-end'>
          <Link
            href={`/${lang}/forgot-password`}
            className='text-sm text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200'
          >
            {dict.auth?.forgotPassword || 'Forgot Password?'}
          </Link>
        </div>

        <div className='pt-2'>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className='text-center space-y-3'>
            <div className='text-red-600 bg-red-50 p-3 rounded-md'>
              {data.message}
            </div>
            {showResendOption && lastEmailAttempt && (
              <div className='bg-blue-50 p-3 rounded-md'>
                <p className='text-sm text-blue-800 mb-2'>
                  If your email isn't verified yet, you can resend the verification email.
                </p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleResendVerification}
                  className='text-blue-600 border-blue-200 hover:bg-blue-100'
                >
                  <Mail className='w-4 h-4 mr-2' />
                  Resend Verification Email
                </Button>
                {resendData && resendData.message && (
                  <p className={`text-xs mt-2 ${resendData.success ? 'text-green-600' : 'text-red-600'}`}>
                    {resendData.message}
                  </p>
                )}
              </div>
            )}
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
