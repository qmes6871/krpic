import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.policy.title,
  description: pageMetadata.policy.description,
  openGraph: {
    title: pageMetadata.policy.title,
    description: pageMetadata.policy.description,
    url: `${siteConfig.url}/policy`,
  },
  alternates: {
    canonical: `${siteConfig.url}/policy`,
  },
};

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
