'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { resetPassword } from '@/lib/actions/password-reset.actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();
  const [data, action] = useFormState(resetPassword, null);

  // Redirect to sign in page on successful password reset
  useEffect(() => {
    if (data?.success) {
      router.push('/sign-in?message=password-reset-success');
    }
  }, [data, router]);

  return (
    <form action={action}>
      <input type='hidden' name='token' value={token} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='password'>New Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            required
            autoComplete='new-password'
          />
        </div>
        <div>
          <Label htmlFor='confirmPassword'>Confirm New Password</Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            required
            autoComplete='new-password'
          />
        </div>
        <div>
          <Button type='submit' className='w-full'>
            Reset Password
          </Button>
        </div>

        {data && !data.success && (
          <div className='text-center text-destructive'>{data.message}</div>
        )}

        <div className='text-sm text-center text-muted-foreground'>
          Remember your password?{' '}
          <Link href='/sign-in' target='_self' className='link'>
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
} 