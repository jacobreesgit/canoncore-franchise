/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for development
  reactStrictMode: true,

  // Optimize images (Vercel handles this automatically)
  images: {
    domains: [],
    unoptimized: false,
  },

  // Environment variables configuration
  env: {
    VERCEL_URL: process.env.VERCEL_URL,
  },

  // Experimental features
  experimental: {
    // Enable app directory features
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },

  // Output configuration
  output: 'standalone',

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Add any redirects here if needed
    ];
  },

  // Rewrites for API routes if needed
  async rewrites() {
    return [
      // Add any rewrites here if needed
    ];
  },
};

module.exports = nextConfig;