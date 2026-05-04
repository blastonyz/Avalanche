import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'encoding', 'thread-stream');
    return config;
  },
};

export default nextConfig;
