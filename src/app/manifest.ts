import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} – Gemeinsam für eine solidarischere Welt`,
    short_name: SITE_NAME,
    description:
      'Internationale humanitäre NGO für Bildung, Gesundheit und nachhaltige Entwicklung.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2F5FA',
    theme_color: '#2C66BE',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
