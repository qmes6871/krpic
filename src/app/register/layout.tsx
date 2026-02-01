import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.register.title,
  description: pageMetadata.register.description,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/register`,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
