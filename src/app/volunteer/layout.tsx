import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Werden Sie Freiwillige:r',
  description:
    'Stellen Sie Ihre Fähigkeiten in den Dienst einer guten Sache. Werden Sie Teil des internationalen Freiwilligennetzwerks von Freunde für Galy und bewerben Sie sich jetzt.',
  alternates: { canonical: '/volunteer' },
  openGraph: {
    title: 'Werden Sie Freiwillige:r | Freunde für Galy',
    description:
      'Stellen Sie Ihre Fähigkeiten in den Dienst einer guten Sache. Werden Sie Teil des internationalen Freiwilligennetzwerks von Freunde für Galy.',
    url: '/volunteer',
  },
};

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
