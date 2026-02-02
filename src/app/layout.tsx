import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import ScrollToTop from '@/components/common/ScrollToTop';
import { siteConfig, pageMetadata } from '@/lib/seo/config';
import { OrganizationJsonLd, WebsiteJsonLd, LocalBusinessJsonLd, ServiceJsonLd, WebPageJsonLd, ImageObjectJsonLd, ProfessionalServiceJsonLd } from '@/components/seo/JsonLd';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import PageTracker from '@/components/analytics/PageTracker';
import Boraware from '@/components/analytics/Boraware';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1e3a5f',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: pageMetadata.home.title,
    template: '%s | 재범방지교육통합센터',
  },
  description: pageMetadata.home.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: pageMetadata.home.title,
    description: pageMetadata.home.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: pageMetadata.home.title,
    description: pageMetadata.home.description,
    images: [siteConfig.ogImage],
  },
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
  verification: {
    google: 'Z0Vy5PZShij4eUj8t1bO-bKZunRs40r2OZ8Dm81wvy0',
    other: {
      'naver-site-verification': 'b94d68fdaf94addd31028cd63f7c6cc593792014',
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <PageTracker />
        <Boraware />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <LocalBusinessJsonLd />
        <ServiceJsonLd />
        <WebPageJsonLd />
        <ImageObjectJsonLd />
        <ProfessionalServiceJsonLd />
        <LayoutWrapper>{children}</LayoutWrapper>
        <ScrollToTop />
      </body>
    </html>
  );
}
