import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.detentionEducation.title,
  description: pageMetadata.detentionEducation.description,
  keywords: ['구속수감자 교육', '수감자 재범방지교육', '구치소 교육', '양형자료', '수료증 발급'],
  openGraph: {
    title: pageMetadata.detentionEducation.title,
    description: pageMetadata.detentionEducation.description,
    url: `${siteConfig.url}/detention-education`,
  },
  alternates: {
    canonical: `${siteConfig.url}/detention-education`,
  },
};

export default function DetentionEducationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
