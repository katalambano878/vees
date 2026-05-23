import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.veesimportationbusiness.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/shop`,                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${baseUrl}/categories`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/about`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/blog`,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${baseUrl}/faqs`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/shipping`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/returns`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/refund-policy`,       lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`,             lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/terms`,               lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('slug, updated_at').eq('status', 'active'),
        supabase.from('categories').select('slug, updated_at').eq('status', 'active'),
      ]);

      if (productsRes.data?.length) {
        productPages = productsRes.data.map((product) => ({
          url: `${baseUrl}/product/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }

      if (categoriesRes.data?.length) {
        categoryPages = categoriesRes.data.map((category) => ({
          url: `${baseUrl}/shop?category=${category.slug}`,
          lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }));
      }
    } catch (error) {
      console.error('Sitemap generation error:', error);
    }
  }

  return [...staticPages, ...productPages, ...categoryPages];
}
