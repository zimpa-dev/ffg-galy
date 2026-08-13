
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { LanguageProvider } from '@/components/language-provider';

export const metadata: Metadata = {
  title: 'FFG-VE Horizon | Ensemble pour un monde plus solidaire',
  description: 'ONG humanitaire internationale dédiée à l’éducation, la santé et le développement durable.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <FirebaseClientProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
