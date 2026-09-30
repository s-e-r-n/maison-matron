import type { MetadataRoute } from "next";
import { site_origin } from "@/lib/site_origin";

const sitemap = (): MetadataRoute.Sitemap => [
  { url: new URL("/", site_origin).href },
  { url: new URL("/refection", site_origin).href },
];

export default sitemap;
