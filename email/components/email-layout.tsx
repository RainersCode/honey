import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
} from '@react-email/components';
import { ReactNode } from 'react';
import { APP_NAME } from '@/lib/constants';
import { EmailLogo } from './email-logo';

interface EmailLayoutProps {
  children: ReactNode;
  previewText: string;
}

export const EmailLayout = ({ children, previewText }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className='bg-[#FFF8F3] font-sans'>
          <Container className='max-w-xl mx-auto my-8'>
            <Section className='bg-white rounded-lg shadow-lg overflow-hidden'>
              {/* Header */}
              <div className='bg-[#FF7A3D] px-8 py-6'>
                <EmailLogo />
              </div>

              {/* Content */}
              <div className='px-8 py-6'>{children}</div>

              {/* Footer */}
              <div className='bg-[#FFE4D2] px-8 py-4 text-center text-sm text-[#1D1D1F]'>
                <p>
                  © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </p>
                <p className='mt-2'>
                  This email was sent by {APP_NAME}. Please do not reply to this
                  email.
                </p>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
