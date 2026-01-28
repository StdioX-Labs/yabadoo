import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed standalone output to avoid Windows symlink permission issues
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eu2.contabostorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
