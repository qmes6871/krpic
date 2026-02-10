import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.forgotPassword.title,
  description: pageMetadata.forgotPassword.description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: pageMetadata.forgotPassword.title,
    description: pageMetadata.forgotPassword.description,
    url: `${siteConfig.url}/forgot-password`,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
