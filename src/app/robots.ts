import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://narenderpahuja.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/dashboard/',
          '/auth/',
          '/api/',
          'sign-in',
          'sign-up',
          'reset-password',
          'verify-email',
          'forgot-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/private/',
          '/dashboard/',
          '/auth/',
          'sign-in',
          'sign-up',
          'reset-password',
          'verify-email',
          'forgot-password',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
