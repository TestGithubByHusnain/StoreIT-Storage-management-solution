import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },

  images: {
    remotePatterns: [
      // Freepik
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      // Pixabay
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },

      // Appwrite Main Domain
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },

      // Appwrite Region-Based Domain (YOUR ERROR)
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io",
        pathname: "/v1/storage/buckets/**",
      },
    ],
  },
};

export default nextConfig;
