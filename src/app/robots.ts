import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/my-courses/',
          '/learn/',
          '/checkout/',
          '/detention-complete/',
          '/verify/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/my-courses/',
          '/learn/',
          '/checkout/',
          '/detention-complete/',
          '/verify/',
        ],
      },
      {
        userAgent: 'Yeti', // 네이버 검색봇
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/my-courses/',
          '/learn/',
          '/checkout/',
          '/detention-complete/',
          '/verify/',
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
