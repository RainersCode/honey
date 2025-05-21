'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { Loader, UserPlus } from 'lucide-react';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button 
        disabled={pending} 
        className="w-full bg-[#FF7A3D] hover:bg-[#ff6a24] text-white font-medium text-lg h-12"
      >
        {pending ? (
          <div className="flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin mr-2" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <UserPlus className="w-5 h-5 mr-2" />
            <span>Create Account</span>
          </div>
        )}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label 
            htmlFor="name" 
            className="text-[#1D1D1F] font-medium"
          >
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
            className="h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label 
            htmlFor="email" 
            className="text-[#1D1D1F] font-medium"
          >
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
            className="h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50"
            placeholder="Enter your email"
          />
        </div>
        <div className="space-y-2">
          <Label 
            htmlFor="password"
            className="text-[#1D1D1F] font-medium"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
            className="h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50"
            placeholder="Create a password"
          />
        </div>
        <div className="space-y-2">
          <Label 
            htmlFor="confirmPassword"
            className="text-[#1D1D1F] font-medium"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.confirmPassword}
            className="h-12 border-[#FFE4D2] focus:border-[#FF7A3D] focus:ring-[#FF7A3D] bg-white/50"
            placeholder="Confirm your password"
          />
        </div>

        <div className="pt-2">
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-red-600 bg-red-50 p-3 rounded-md">
            {data.message}
          </div>
        )}

        <div className="text-center space-y-4 pt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FFE4D2]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>
          
          <Link 
            href="/sign-in" 
            className="inline-block text-[#FF7A3D] hover:text-[#ff6a24] font-medium transition-colors duration-200"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
