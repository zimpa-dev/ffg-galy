import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Willkommen bei Freunde für Galy e.V.',
  description:
    'Der Verein Freunde für Galy e.V. sammelt Spenden zur Unterstützung der Bewohnerinnen und Bewohner des Stadtteils Galy in Mombeyah, Guinea: Landwirtschaft, Wasser, Gesundheit, Bildung und Infrastruktur.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Willkommen bei Freunde für Galy e.V.',
    description:
      'Gemeinsam für die Entwicklung des Stadtteils Galy in Mombeyah: Landwirtschaft, Wasser, Gesundheit, Bildung und Infrastruktur.',
    url: '/blog',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
