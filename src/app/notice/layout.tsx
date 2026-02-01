import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.notice.title,
  description: pageMetadata.notice.description,
  openGraph: {
    title: pageMetadata.notice.title,
    description: pageMetadata.notice.description,
    url: `${siteConfig.url}/notice`,
  },
  alternates: {
    canonical: `${siteConfig.url}/notice`,
  },
};

export default function NoticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
