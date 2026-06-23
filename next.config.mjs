/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [100],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840, 7680],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 640, 1080, 1920],
    minimumCacheTTL: 60,
    remotePatterns: [],
  },
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
