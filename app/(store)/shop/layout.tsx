import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse VEES Importation Business collection. Quality imports in Accra, Ghana. Fast delivery.',
  keywords: [
    'shop VEES Importation',
    'Accra Ghana shop',
    'online store Ghana',
    'VEES Importation Business shop',
    'buy online Ghana',
  ].join(', '),
  openGraph: {
    title: 'Shop | VEES Importation Business',
    description: 'Browse our collection. Quality imports, fast delivery in Ghana.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Shop — VEES Importation Business Ghana', type: 'image/png' }],
    url: '/shop',
    type: 'website',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop | VEES Importation Business',
    description: 'Browse products at VEES Importation Business Ghana.',
    images: [{ url: '/opengraph-image', alt: 'Shop — VEES Importation Business' }],
  },
  alternates: { canonical: '/shop' },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
