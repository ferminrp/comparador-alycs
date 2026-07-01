import type { NextConfig } from "next";
import alycsData from "./data/alycs.json";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return alycsData.alycs.map((alyc) => ({
      source: `/alyc/${alyc.id}`,
      destination: `/${alyc.id}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
