import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactFormEmail = ({ name, email, subject, message }: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`https://your-domain.com/images/logo.png`}
              width="50"
              height="50"
              alt="Honey Farm"
              style={logo}
            />
          </Section>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Text style={text}>
            You have received a new message from your website contact form.
          </Text>
          <Hr style={hr} />
          <Section style={detailsSection}>
            <Text style={detailLabel}>Name:</Text>
            <Text style={detailValue}>{name}</Text>
            
            <Text style={detailLabel}>Email:</Text>
            <Text style={detailValue}>{email}</Text>
            
            <Text style={detailLabel}>Subject:</Text>
            <Text style={detailValue}>{subject}</Text>
            
            <Text style={detailLabel}>Message:</Text>
            <Text style={messageValue}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            This email was sent from your website's contact form.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactFormEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1D1D1F',
  fontSize: '24px',
  fontWeight: 'normal',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  margin: '16px 0',
};

const detailsSection = {
  padding: '24px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e6e8eb',
  borderRadius: '8px',
  margin: '24px 0',
};

const detailLabel = {
  color: '#1D1D1F',
  fontSize: '14px',
  fontWeight: '600',
  margin: '16px 0 4px 0',
};

const detailValue = {
  color: '#525f7f',
  fontSize: '16px',
  margin: '0 0 16px 0',
};

const messageValue = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
  whiteSpace: 'pre-wrap' as const,
};

const hr = {
  borderColor: '#e6e8eb',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '16px 0',
}; 