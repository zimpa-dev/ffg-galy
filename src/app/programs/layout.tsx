import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsere Programme',
  description:
    'Wir handeln über strukturierte Programme in Bildung, Gesundheit, Wasser & Hygiene sowie Nothilfe, um Grundbedürfnisse zu decken und eine eigenständige Zukunft vorzubereiten.',
  alternates: { canonical: '/programs' },
  openGraph: {
    title: 'Unsere Programme | Freunde für Galy',
    description:
      'Wir handeln über strukturierte Programme in Bildung, Gesundheit, Wasser & Hygiene sowie Nothilfe, um eine eigenständige Zukunft vorzubereiten.',
    url: '/programs',
  },
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
