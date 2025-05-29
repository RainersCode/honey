import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Locale, i18n } from '@/config/i18n.config';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/lib/context/cart-context';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import '@/assets/styles/globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic', 'latin-ext'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | Honey Farm',
      default: 'Honey Farm - Pure Natural Honey',
    },
    description:
      'Experience the authentic taste of nature with our pure, natural honey straight from our family farm.',
    keywords: [
      'honey',
      'natural honey',
      'raw honey',
      'organic honey',
      'bee farm',
      'honey products',
    ],
  };
}

export async function generateStaticParams() {
  // Ensure we always return valid locale parameters
  try {
    return i18n.locales.map((locale) => ({ lang: locale }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ lang: 'en' }]; // Fallback to English only
  }
}

// Allow for dynamic rendering when needed
export const dynamic = 'auto';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const resolvedParams = await params;
  
  // Handle case where params might be undefined during static generation
  if (!resolvedParams || !resolvedParams.lang) {
    return (
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${playfairDisplay.variable}`}
      >
        <body className={`${inter.className} antialiased`}>
          <CartProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='light'
              enableSystem
              disableTransitionOnChange
            >
              <main className='min-h-screen'>{children}</main>
              <Toaster />
            </ThemeProvider>
          </CartProvider>
        </body>
      </html>
    );
  }
  
  const { lang } = resolvedParams;
  
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <Header lang={lang} />
            <main className='min-h-screen'>{children}</main>
            <Footer lang={lang} />
            <Toaster lang={lang} />
          </ThemeProvider>
        </CartProvider>
      </body>
    </html>
  );
}
