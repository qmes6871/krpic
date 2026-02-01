import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.login.title,
  description: pageMetadata.login.description,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${siteConfig.url}/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
