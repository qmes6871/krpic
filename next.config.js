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
}

module.exports = nextConfig
