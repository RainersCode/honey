import { Button, Text } from '@react-email/components';
import { APP_NAME } from '@/lib/constants';
import { EmailLayout } from './components/email-layout';

interface VerifyEmailProps {
  verificationUrl: string;
  userName: string;
}

export const VerifyEmail = ({ verificationUrl, userName }: VerifyEmailProps) => {
  return (
    <EmailLayout previewText={`Welcome to ${APP_NAME} - Verify your email`}>
      <div className='text-center'>
        <h1 className='text-2xl font-serif text-[#1D1D1F] mb-6'>
          Welcome to {APP_NAME}!
        </h1>

        <Text className='text-[#666666] mb-6'>
          Hi {userName},
        </Text>

        <Text className='text-[#666666] mb-8'>
          Thank you for signing up for {APP_NAME}! To complete your registration and activate your account, 
          please verify your email address by clicking the button below.
        </Text>

        <div className='mb-8'>
          <Button
            href={verificationUrl}
            className='bg-[#FF7A3D] text-white px-8 py-3 rounded-md font-medium hover:bg-[#ff6a24] transition-colors duration-200'
          >
            Verify Email Address
          </Button>
        </div>

        <Text className='text-[#666666] text-sm'>
          Or copy and paste this URL into your browser:{' '}
          <a
            href={verificationUrl}
            className='text-[#FF7A3D] hover:text-[#ff6a24] underline'
          >
            {verificationUrl}
          </a>
        </Text>

        <div className='mt-8 pt-8 border-t border-[#FFE4D2]'>
          <Text className='text-[#666666] text-sm'>
            This verification link will expire in 24 hours. If you didn't create an account with {APP_NAME}, 
            you can safely ignore this email.
          </Text>
        </div>
      </div>
    </EmailLayout>
  );
}; 