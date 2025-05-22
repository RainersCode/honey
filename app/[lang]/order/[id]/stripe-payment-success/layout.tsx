import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your payment has been processed successfully',
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 