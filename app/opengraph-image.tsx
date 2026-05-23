import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'VEES Importation Business — Quality Imports · Accra, Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.veesimportationbusiness.com';
  const imageUrl = `${siteUrl}/vees-brand.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000000',
          padding: '40px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src={imageUrl}
          alt="VEES Importation logo"
          width={size.width}
          height={size.height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
