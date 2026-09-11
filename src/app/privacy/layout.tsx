import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzerklärung von FFG-VE Horizon gemäß Art. 13 DSGVO.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
