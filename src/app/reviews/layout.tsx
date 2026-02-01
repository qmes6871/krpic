import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.reviews.title,
  description: pageMetadata.reviews.description,
  openGraph: {
    title: pageMetadata.reviews.title,
    description: pageMetadata.reviews.description,
    url: `${siteConfig.url}/reviews`,
  },
  alternates: {
    canonical: `${siteConfig.url}/reviews`,
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
