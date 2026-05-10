import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["framer-motion"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/w**",
      },
    ],
  },
};

export default nextConfig;
