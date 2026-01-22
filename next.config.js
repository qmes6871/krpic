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
    ],
  },
}

module.exports = nextConfig
