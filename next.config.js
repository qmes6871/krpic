/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/krpic', // 독립 도메인 사용으로 제거
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'janbisapzgazpadjiniv.supabase.co',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/%EC%A4%80%EB%B2%95%EC%9D%98%EC%8B%9D%EA%B5%90%EC%9C%A1',
        destination: '/education/law-compliance',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
