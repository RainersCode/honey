'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';
import { requestPasswordReset } from '@/lib/actions/password-reset.actions';
import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [data, action] = useFormState(requestPasswordReset, null);

  return (
    <form action={action}>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            required
            autoComplete='email'
          />
        </div>
        <div>
          <Button type='submit' className='w-full'>
            Send Reset Link
          </Button>
        </div>

        {data && (
          <div
            className={`text-center ${
              data.success ? 'text-green-600' : 'text-destructive'
            }`}
          >
            {data.message}
          </div>
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