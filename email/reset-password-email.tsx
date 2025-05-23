import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { APP_NAME } from '@/lib/constants';

interface ResetPasswordEmailProps {
  resetUrl: string;
}

export const ResetPasswordEmail = ({ resetUrl }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for {APP_NAME}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            We received a request to reset your password for your {APP_NAME}{' '}
            account. If you didn't request this, you can safely ignore this
            email.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>
          <Text style={text}>
            Or copy and paste this URL into your browser:{' '}
            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This link will expire in 1 hour. After that, you'll need to request
            a new password reset link.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 20px',
};

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
};

const buttonContainer = {
  margin: '24px 0',
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '4px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  padding: '12px 24px',
  textDecoration: 'none',
};

const link = {
  color: '#067df7',
  textDecoration: 'underline',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '26px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
};
