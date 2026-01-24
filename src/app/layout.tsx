import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import KakaoFloatingBanner from '@/components/common/KakaoFloatingBanner';

export const metadata: Metadata = {
  title: '재범방지교육통합센터',
  description: '법원, 검찰 인정 공인 재범방지교육 전문기관. 음주운전, 폭력범죄, 성범죄 등 다양한 재범방지교육 프로그램을 제공합니다.',
  keywords: '재범방지교육, 음주운전교육, 폭력예방교육, 성범죄예방교육, 수강명령, 이수명령',
  icons: {
    icon: [
      { url: '/krpic/favicon.ico', sizes: 'any' },
      { url: '/krpic/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/krpic/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/krpic/apple-touch-icon.png',
  },
  openGraph: {
    title: '재범방지교육통합센터',
    description: '법원, 검찰 인정 공인 재범방지교육 전문기관',
    type: 'website',
    locale: 'ko_KR',
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
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <KakaoFloatingBanner />
      </body>
    </html>
  );
}
