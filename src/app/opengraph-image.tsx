import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/site';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2C66BE 0%, #1a4489 100%)',
          color: '#F2F5FA',
          fontFamily: 'sans-serif',
          padding: 80,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: '#2BB24C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          F
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 32, marginTop: 24, color: '#e2ebf9' }}>
          Gemeinsam für eine solidarischere Welt
        </div>
      </div>
    ),
    { ...size }
  );
}
