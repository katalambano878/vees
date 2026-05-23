import type { Metadata } from "next";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.veesimportationbusiness.com';
const siteName = 'VEES Importation Business';
const siteTagline = 'Quality Imports · Accra, Ghana';
const siteDescription =
  'VEES Importation Business — quality imports in Accra, Ghana. Shop with confidence. Fast delivery. Contact: 0557121535 / +8618578636457. Snapchat: ghanajollof21 · TikTok: vees_importation';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | ${siteTagline}`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'VEES Importation',
    'imports Accra Ghana',
    'online shop Ghana',
    'Accra Ghana store',
    'quality imports Ghana',
    'VEES Importation Business',
    'shop Accra',
    'Ghana e-commerce',
  ],
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'Shopping',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [{ url: '/vees-brand.png', type: 'image/png' }],
    apple: '/vees-brand.png',
    shortcut: '/vees-brand.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: siteUrl,
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${siteName} — Quality Imports Accra Ghana`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription,
    images: [{ url: '/opengraph-image', alt: `${siteName} — Quality Imports Accra Ghana` }],
    creator: '@vees_importation',
    site: '@vees_importation',
  },
  alternates: {
    canonical: siteUrl,
  },
  other: {
    'theme-color': '#0F172A',
    'msapplication-TileColor': '#0F172A',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteName,
    'format-detection': 'telephone=no',
    'geo.region': 'GH',
    'geo.placename': 'Accra',
    'ICBM': '5.58, -0.24',
  },
};

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// Google reCAPTCHA v3 Site Key
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout: fonts apply to all pages */}
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Organization Schema — keep NAP consistent with Google My Business */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VEES Importation Business",
          "alternateName": "VEES Importation",
          "url": siteUrl,
          "logo": { "@type": "ImageObject", "url": `${siteUrl}/vees-brand.png`, "width": 1024, "height": 1024 },
          "image": `${siteUrl}/opengraph-image`,
          "description": "Quality imports in Accra, Ghana. VEES Importation Business.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kwashieman- Opposite Been-To complex",
            "addressLocality": "Accra",
            "addressRegion": "Greater Accra",
            "addressCountry": "GH"
          },
          "contactPoint": [
            { "@type": "ContactPoint", "contactType": "customer service", "telephone": "+233557121535", "availableLanguage": ["English"], "areaServed": "GH" },
            { "@type": "ContactPoint", "contactType": "sales", "telephone": "+8618578636457", "areaServed": "GH" }
          ],
          "sameAs": [
            "https://www.snapchat.com/add/ghanajollof21",
            "https://www.tiktok.com/@vees_importation"
          ]
        })}} />

        {/* WebSite Schema with SearchAction */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "VEES Importation Business",
          "url": siteUrl,
          "description": "Quality imports in Accra, Ghana. Shop online.",
          "inLanguage": "en-GH",
          "potentialAction": {
            "@type": "SearchAction",
            "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/shop?search={search_term_string}` },
            "query-input": "required name=search_term_string"
          }
        })}} />

        {/* FAQ Schema for rich results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Where is VEES Importation Business located?", "acceptedAnswer": { "@type": "Answer", "text": "VEES Importation Business is based in Accra, Ghana. We serve customers across Ghana with quality imports." } },
            { "@type": "Question", "name": "How can I contact VEES Importation?", "acceptedAnswer": { "@type": "Answer", "text": "You can reach us by phone at 0557121535 or +8618578636457. Find us on Snapchat: ghanajollof21 and TikTok: vees_importation." } },
            { "@type": "Question", "name": "Do you ship across Ghana?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer delivery across Ghana. Check our shipping policy for details." } },
            { "@type": "Question", "name": "What payment methods do you accept?", "acceptedAnswer": { "@type": "Answer", "text": "We accept Mobile Money, bank transfer, and other methods. See checkout for options." } }
          ]
        })}} />

        {/* LocalBusiness / Store Schema — for Google My Business & local SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "VEES Importation Business",
          "description": "Quality imports in Accra, Ghana. Shop online with VEES Importation. Physical store in Kwashieman, Accra.",
          "url": siteUrl,
          "image": `${siteUrl}/opengraph-image`,
          "logo": `${siteUrl}/vees-brand.png`,
          "telephone": "+233557121535",
          "priceRange": "GHS",
          "currenciesAccepted": "GHS",
          "paymentAccepted": "Mobile Money, Bank Transfer, Cash",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kwashieman- Opposite Been-To complex",
            "addressLocality": "Accra",
            "addressRegion": "Greater Accra",
            "addressCountry": "GH"
          },
          "geo": { "@type": "GeoCoordinates", "latitude": 5.58, "longitude": -0.24 },
          "openingHoursSpecification": [
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "opens": "08:30", "closes": "18:00" }
          ],
          "areaServed": { "@type": "Country", "name": "Ghana" },
          "sameAs": [
            "https://www.snapchat.com/add/ghanajollof21",
            "https://www.tiktok.com/@vees_importation"
          ]
        })}} />
      </head>

      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google reCAPTCHA v3 */}
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}

      <body className="antialiased font-sans overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>
        <CartProvider>
          <WishlistProvider>
            <div id="main-content">
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
