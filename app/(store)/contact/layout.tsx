import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — VEES Importation Business · Accra, Ghana',
  description:
    'Get in touch with VEES Importation Business. Contact us for orders, enquiries or any questions. Phone: 0557121535 / +8618578636457. Snapchat: ghanajollof21 · TikTok: vees_importation.',
  keywords: [
    'contact VEES Importation',
    'Accra Ghana contact',
    'VEES Importation Business contact',
  ].join(', '),
  openGraph: {
    title: 'Contact VEES Importation Business | Accra, Ghana',
    description:
      'Get in touch. 0557121535 / +8618578636457. Snapchat: ghanajollof21 · TikTok: vees_importation.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Contact VEES Importation Business Accra Ghana', type: 'image/png' }],
    url: '/contact',
    locale: 'en_GH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact VEES Importation Business | Accra, Ghana',
    description: 'Get in touch. 0557121535 / +8618578636457.',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
