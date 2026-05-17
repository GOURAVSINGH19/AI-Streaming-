import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin Turbopack root when a parent directory also has a lockfile.
   * Wrong root → duplicate React → `useContext` of null during `/_global-error` prerender.
   */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
