import { Metadata } from 'next';
import { Container } from '@/components/ui/container';

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View your order details',
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className="py-10">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </div>
    </Container>
  );
} 