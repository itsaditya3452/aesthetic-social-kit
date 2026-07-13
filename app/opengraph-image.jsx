import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Aesthetic Social Kit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #F6E9E4 0%, #EFE6F4 50%, #E4EEE0 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '10px 28px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid #E4DFD3',
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 20, color: '#5B6B57', fontWeight: 600, letterSpacing: 2 }}>
            ✦ ZERO BACKEND · RUNS IN-BROWSER
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            color: '#2B2A28',
            letterSpacing: -2,
          }}
        >
          Aesthetic Social Kit
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            color: '#6B665C',
            marginTop: 24,
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          Animated Story Assets · Viral Reels Scripts · Caption Engagement Studio
        </div>
      </div>
    ),
    { ...size }
  );
}
