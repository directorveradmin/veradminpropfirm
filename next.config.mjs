import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["better-sqlite3"],
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;