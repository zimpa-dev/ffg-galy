import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impakt-Galerie',
  description:
    'Entdecken Sie unsere Einsätze vor Ort in Bildern: Gesundheit, Bildung, Wasser & Hygiene, Nothilfe und Veranstaltungen. Jedes Foto ist ein Fenster zur Solidarität.',
  alternates: { canonical: '/transparency' },
  openGraph: {
    title: 'Impakt-Galerie | FFG-VE Horizon',
    description:
      'Entdecken Sie unsere Einsätze vor Ort in Bildern: Gesundheit, Bildung, Wasser & Hygiene, Nothilfe und Veranstaltungen.',
    url: '/transparency',
  },
};

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
