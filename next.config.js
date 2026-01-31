/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/krpic',
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
