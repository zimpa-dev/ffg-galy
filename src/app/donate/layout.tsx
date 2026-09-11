import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spenden',
  description:
    'Unterstützen Sie FFG-VE Horizon mit einer einmaligen oder monatlichen Spende, oder bieten Sie eine Sachspende an. 82 % der Mittel fließen direkt in unsere Programme vor Ort.',
  alternates: { canonical: '/donate' },
  openGraph: {
    title: 'Spenden | FFG-VE Horizon',
    description:
      'Unterstützen Sie FFG-VE Horizon mit einer einmaligen oder monatlichen Spende, oder bieten Sie eine Sachspende an.',
    url: '/donate',
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
