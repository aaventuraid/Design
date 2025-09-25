/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Use standalone output only in production (avoid dev depending on build artifacts)
  ...(isProd ? { output: 'standalone' } : {}),

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },

  // Optimize for Coolify deployment
  trailingSlash: false,
  poweredByHeader: false,

  // Environment variables that should be available in the browser
  env: {
    COOLIFY_URL: process.env.COOLIFY_URL,
    COOLIFY_FQDN: process.env.COOLIFY_FQDN,
  },

  // Image optimization settings for production
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Note: NEXT_TELEMETRY_DISABLED=1 environment variable disables telemetry

  // Headers configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

export default nextConfig;
