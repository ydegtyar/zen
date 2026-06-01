import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/app-build',
        destination: '/app-build/index.html',
      },
      {
        source: '/app-build/',
        destination: '/app-build/index.html',
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
