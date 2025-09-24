/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  distDir: isProd ? '.next' : '.next-dev',
  output: isProd ? 'standalone' : undefined,
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
  // Optimize for Coolify deployment
  trailingSlash: false,
  poweredByHeader: false,
};

export default nextConfig;
