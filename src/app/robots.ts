import type { MetadataRoute } from "next";
import { site_origin } from "@/lib/site_origin";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: new URL("/sitemap.xml", site_origin).href,
});

export default robots;
