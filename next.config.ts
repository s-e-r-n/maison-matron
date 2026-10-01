import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,
  experimental: { typedEnv: true },
  headers: async () => [
    {
      source: "/maison-matron.vcf",
      headers: [{ key: "Content-Type", value: "text/vcard; charset=utf-8" }],
    },
  ],
};

export default nextConfig;
