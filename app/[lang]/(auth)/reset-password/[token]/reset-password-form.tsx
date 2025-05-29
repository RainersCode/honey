'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { resetPassword } from '@/lib/actions/password-reset.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader, Lock } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/config/i18n.config';

interface Props {
  token: string;
  lang: Locale;
}

export default function ResetPasswordForm({ token, lang }: Props) {
  const [dict, setDict] = useState<any>(null);
  const router = useRouter();
  const [data, action] = useFormState(resetPassword, null);

  useEffect(() => {
    const loadDict = async () => {
      const dictionary = await getDictionary(lang);
      setDict(dictionary);
    };
    loadDict();
  }, [lang]);

  // Redirect to sign in page on successful password reset
  useEffect(() => {
    if (data?.success) {
      router.push(`/${lang}/sign-in?message=password-reset-success`);
    }
  }, [data, router, lang]);

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
              {dict?.auth?.resettingPassword || 'Resetting Password...'}
            </span>
          </div>
        ) : (
          <div className='flex items-center justify-center'>
            <Lock className='w-5 h-5 mr-2' />
            <span>{dict?.auth?.resetPassword || 'Reset Password'}</span>
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
      <input type='hidden' name='token' value={token} />
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label htmlFor='password' className='text-[#1D1D1F] font-medium'>
            {dict.auth?.newPassword || 'New Password'}
          </Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='new-password'
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={
              dict.auth?.enterNewPassword || 'Enter your new password'
            }
          />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='confirmPassword'
            className='text-[#1D1D1F] font-medium'
          >
            {dict.auth?.confirmNewPassword || 'Confirm New Password'}
          </Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            autoComplete='new-password'
            className='h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50'
            placeholder={
              dict.auth?.confirmNewPassword || 'Confirm your new password'
            }
          />
        </div>

        <div className='pt-2'>
          <ResetButton />
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
}
