/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسين الصور
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Headers للأمان والـ Caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
        ]
      },
      {
        source: '/api/og',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/.well-known/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ]
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=3600' }
        ]
      }
    ];
  },

  // Compression
  compress: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  reactStrictMode: true,

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;