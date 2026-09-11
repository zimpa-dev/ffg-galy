import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aktuelles & Berichte',
  description:
    'Verfolgen Sie die tägliche Arbeit von FFG-VE Horizon und entdecken Sie die Gesichter der Solidarität in unseren aktuellen Berichten und Nachrichten.',
  alternates: { canonical: '/news' },
  openGraph: {
    title: 'Aktuelles & Berichte | FFG-VE Horizon',
    description:
      'Verfolgen Sie die tägliche Arbeit von FFG-VE Horizon und entdecken Sie die Gesichter der Solidarität.',
    url: '/news',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
