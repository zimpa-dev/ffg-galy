import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns',
  description:
    'Gegründet 2005, engagiert sich Freunde für Galy in über 35 Ländern für Solidarität, Transparenz, Integrität und Inklusion. Entdecken Sie unsere Geschichte, Mission und Vision.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'Über uns | Freunde für Galy',
    description:
      'Gegründet 2005, engagiert sich Freunde für Galy in über 35 Ländern für Solidarität, Transparenz, Integrität und Inklusion.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
