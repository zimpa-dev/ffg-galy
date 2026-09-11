import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Eine Frage zu unseren Projekten? Möchten Sie uns unterstützen oder mit uns zusammenarbeiten? Kontaktieren Sie das Team von FFG-VE Horizon.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Kontakt | FFG-VE Horizon',
    description:
      'Eine Frage zu unseren Projekten? Möchten Sie uns unterstützen oder mit uns zusammenarbeiten? Kontaktieren Sie unser Team.',
    url: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
