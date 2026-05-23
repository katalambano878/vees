# SEO & Google My Business setup

Use this checklist when putting the site on Google My Business and Search Console.

## 1. Environment variables

In `.env.local` set:

```env
# Your live site URL (no trailing slash)
NEXT_PUBLIC_APP_URL=https://www.veesimportationbusiness.com

# After verifying in Google Search Console, paste the content value from the meta tag:
# <meta name="google-site-verification" content="YOUR_CODE" />
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code

# Optional: Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 2. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property: **URL prefix** → `https://www.veesimportationbusiness.com` (or your domain).
3. Verify using **HTML tag**: copy the `content` value and set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in `.env.local`, then redeploy.
4. After verification:
   - Submit sitemap: `https://www.veesimportationbusiness.com/sitemap.xml`
   - Request indexing for: `/`, `/contact`, `/shop`, `/about`.

## 3. Google My Business (Google Business Profile)

1. Create or claim your profile at [business.google.com](https://business.google.com).
2. Use **exactly** the same NAP (Name, Address, Phone) as on the site:
   - **Name:** VEES Importation Business
   - **Address:** Kwashieman- Opposite Been-To complex, Accra, Ghana
   - **Phone:** 0557121535 / +233557121535
3. Set **opening hours:** Tuesday–Saturday, 8:30 AM–6:00 PM.
4. Add **website:** your live URL.
5. Add **categories** (e.g. “Store”, “Import-export company”).
6. Link your **Google Business Profile** to the same Google account you use for Search Console so Google can associate the website with the listing.

## 4. What’s already implemented on the site

- **Structured data (JSON-LD):** Organization, LocalBusiness/Store (with address, phone, opening hours, geo), WebSite (with search action), FAQPage.
- **Meta:** Title template, description, keywords, Open Graph, Twitter cards, canonical URLs.
- **Local SEO:** Full street address in schema, geo coordinates (Accra), `geo.region` and `geo.placename` meta tags.
- **Technical:** `sitemap.xml`, `robots.txt` (sitemap URL, allow storefront; disallow admin/checkout/cart/account).
- **PWA:** Web manifest with name, icons, theme color.

## 5. After going live

- In Search Console, monitor **Coverage** and **Core Web Vitals**.
- In Google Business Profile, post updates, respond to reviews, and add photos.
- Keep NAP identical on the website, GMB, and any other directories.
