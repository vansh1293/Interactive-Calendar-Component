import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow Next.js Image to serve from local /public directory
    // No external domains needed — all images are local
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1440],
  },
  // Experimental: optimise fonts
  experimental: {},
}

export default nextConfig
