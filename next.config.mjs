/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  // Disable standalone output for better development experience
  // ...(isProd ? { output: 'standalone' } : {}),

  // Optimize for Coolify deployment
  trailingSlash: false,
  poweredByHeader: false,

  // Environment variables that should be available in the browser
  env: {
    COOLIFY_URL: process.env.COOLIFY_URL,
    COOLIFY_FQDN: process.env.COOLIFY_FQDN,
  },

  // Configure server settings for proxy environments
  serverRuntimeConfig: {
    // Tell Next.js we're behind a proxy
    proxyMode: true,
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

  // Headers configuration for reverse proxy
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

  // Handle redirects properly (prevent redirect loops)
  async redirects() {
    return [];
  },
};

export default nextConfig;
