import { Metadata } from 'next';
import { pageMetadata, siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: pageMetadata.resetPassword.title,
  description: pageMetadata.resetPassword.description,
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: pageMetadata.resetPassword.title,
    description: pageMetadata.resetPassword.description,
    url: `${siteConfig.url}/auth/reset-password`,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
