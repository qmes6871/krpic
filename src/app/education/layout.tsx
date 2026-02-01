import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.education.title,
  description: pageMetadata.education.description,
  openGraph: {
    title: pageMetadata.education.title,
    description: pageMetadata.education.description,
    url: `${siteConfig.url}/education`,
  },
  alternates: {
    canonical: `${siteConfig.url}/education`,
  },
};

export default function EducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
