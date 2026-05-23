import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VEES Importation Business',
    short_name: 'VEES',
    description: "Quality imports in Accra, Ghana. Shop online.",
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0F172A',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle'],
    lang: 'en-GH',
    icons: [
      { src: '/vees-brand.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/vees-brand.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    screenshots: [
      { src: '/opengraph-image', sizes: '1200x630', type: 'image/png', label: 'VEES Importation Business Homepage' },
    ],
    shortcuts: [
      { name: 'Shop', short_name: 'Shop', description: 'Browse products', url: '/shop', icons: [{ src: '/vees-brand.png', sizes: '96x96', type: 'image/png' }] },
      { name: 'Contact', short_name: 'Contact', description: 'Get in touch', url: '/contact', icons: [{ src: '/vees-brand.png', sizes: '96x96', type: 'image/png' }] },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
