import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-host friendly output for the single Nixpacks/Railway service.
  output: "standalone",
};

export default nextConfig;
