import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Explore all categories at VEES Importation Business. Shop quality imports in Accra, Ghana.',
  keywords: [
    'categories VEES Importation',
    'shop by category Ghana',
    'Accra Ghana store categories',
  ].join(', '),
  openGraph: {
    title: 'Categories | VEES Importation Business Ghana',
    description: 'All categories at VEES Importation Business.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Categories — VEES Importation Business Ghana', type: 'image/png' }],
    url: '/categories',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Categories | VEES Importation Business',
    description: 'All categories at VEES Importation Business Ghana.',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: '/categories' },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
