import { Container } from '@/components/ui/container';

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <div className='py-10'>
        <div className='mx-auto max-w-6xl'>{children}</div>
      </div>
    </Container>
  );
}
