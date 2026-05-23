import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us — Accra, Ghana',
  description:
    'Learn about VEES Importation Business — quality imports in Accra, Ghana. We specialize in bringing quality products to our customers with reliable service.',
  keywords: [
    'about VEES Importation',
    'Accra Ghana business',
    'imports Ghana',
    'VEES Importation Business',
    'Accra Ghana store',
  ].join(', '),
  openGraph: {
    title: 'About VEES Importation Business | Accra, Ghana',
    description: 'Quality imports in Accra, Ghana. Our story and mission.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'About VEES Importation Business — Accra Ghana', type: 'image/png' }],
    url: '/about',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About VEES Importation Business | Accra, Ghana',
    description: 'Quality imports in Accra, Ghana.',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: '/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
