/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840, 7680],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 640, 1080, 1920],
    minimumCacheTTL: 0,
    remotePatterns: [],
    unoptimized: true, // Fixes Vercel INVALID_IMAGE_OPTIMIZE_REQUEST for rewritten Supabase URLs
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: false,
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, max-age=0, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, max-age=0, must-revalidate' },
        ],
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/images/:path*',
          destination: 'https://fbogcjvivaehpsgabtqv.supabase.co/storage/v1/object/public/images/:path*',
        },
      ],
    }
  },
};

export default nextConfig;
