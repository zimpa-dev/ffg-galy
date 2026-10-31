import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spenden',
  description:
    'Unterstützen Sie Freunde für Galy mit einer einmaligen oder monatlichen Spende, oder bieten Sie eine Sachspende an. 82 % der Mittel fließen direkt in unsere Programme vor Ort.',
  alternates: { canonical: '/donate' },
  openGraph: {
    title: 'Spenden | Freunde für Galy',
    description:
      'Unterstützen Sie Freunde für Galy mit einer einmaligen oder monatlichen Spende, oder bieten Sie eine Sachspende an.',
    url: '/donate',
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
