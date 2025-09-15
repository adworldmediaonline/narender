import { getBlogs } from '@/lib/server/blog';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.narenderpahuja.in';

  // Get all published blogs
  const blogsResult = await getBlogs();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogsResult.map(blog => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt || blog.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
