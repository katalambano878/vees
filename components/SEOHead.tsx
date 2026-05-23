import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.veesimportationbusiness.com';
const SITE_NAME = 'VEES Importation Business';
const DEFAULT_OG = '/opengraph-image';

const BASE_KEYWORDS = [
  'VEES Importation',
  'imports Accra Ghana',
  'online shop Ghana',
  'Accra Ghana store',
  'quality imports Ghana',
  'VEES Importation Business',
];

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: string;
  category?: string;
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  canonical?: string;
}

export function generateMetadata({
  title,
  description = 'VEES Importation Business — quality imports in Accra, Ghana. Shop online with fast delivery.',
  keywords = [],
  ogImage = DEFAULT_OG,
  ogImageAlt,
  ogType = 'website',
  noindex = false,
  canonical,
}: SEOProps): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const allKeywords = [...new Set([...keywords, ...BASE_KEYWORDS])];
  const canonicalUrl = canonical || SITE_URL;

  return {
    title: pageTitle,
    description,
    keywords: allKeywords.join(', '),
    openGraph: {
      title: pageTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt || pageTitle, type: 'image/png' }],
      type: ogType as any,
      siteName: SITE_NAME,
      locale: 'en_GH',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [{ url: ogImage, alt: ogImageAlt || pageTitle }],
      creator: '@vees_importation',
      site: '@vees_importation',
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
    alternates: { canonical: canonicalUrl },
  };
}

/** Product JSON-LD schema */
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand || SITE_NAME },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'GHS',
      availability: product.availability === 'in_stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
      seller: { '@type': 'Organization', name: SITE_NAME },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', currency: 'GHS' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'GH' },
      },
    },
    ...(product.rating && product.reviewCount ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    ...(product.category ? { category: product.category } : {}),
  };
}

/** Breadcrumb JSON-LD schema */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** FAQPage JSON-LD schema */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

/** ItemList schema for category/collection pages */
export function generateItemListSchema(items: { name: string; url: string; image?: string; position: number }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Products — VEES Importation Business',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

/** Inline JSON-LD script component */
export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
