import type { NextConfig } from "next";
import { alycs } from "@/lib/alycs";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return alycs.map((alyc) => ({
      source: `/alyc/${alyc.id}`,
      destination: `/${alyc.id}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
