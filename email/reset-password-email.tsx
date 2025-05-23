import { Button, Text } from '@react-email/components';
import { APP_NAME } from '@/lib/constants';
import { EmailLayout } from './components/email-layout';

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => {
  return (
    <EmailLayout previewText={`Reset your password for ${APP_NAME}`}>
      <div className='text-center'>
        <h1 className='text-2xl font-serif text-[#1D1D1F] mb-6'>
          Reset Your Password
        </h1>

        <Text className='text-[#666666] mb-8'>
          We received a request to reset your password for your {APP_NAME}{' '}
          account. If you didn't request this, you can safely ignore this email.
        </Text>

        <div className='mb-8'>
          <Button
            href={resetUrl}
            className='bg-[#FF7A3D] text-white px-8 py-3 rounded-md font-medium hover:bg-[#ff6a24] transition-colors duration-200'
          >
            Reset Password
          </Button>
        </div>

        <Text className='text-[#666666] text-sm'>
          Or copy and paste this URL into your browser:{' '}
          <a
            href={resetUrl}
            className='text-[#FF7A3D] hover:text-[#ff6a24] underline'
          >
            {resetUrl}
          </a>
        </Text>

        <div className='mt-8 pt-8 border-t border-[#FFE4D2]'>
          <Text className='text-[#666666] text-sm'>
            This link will expire in 1 hour. After that, you'll need to request
            a new password reset link.
          </Text>
        </div>
      </div>
    </EmailLayout>
  );
};
