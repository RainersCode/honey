import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div 
      className='flex min-h-screen flex-col relative'
      style={{
        backgroundImage: 'url("/images/background/Cute_Bee.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Semi-transparent overlay */}
      <div 
        className="absolute inset-0 bg-white/90"
        style={{ backdropFilter: 'blur(2px)' }}
      />
      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className='flex-1 wrapper'>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
