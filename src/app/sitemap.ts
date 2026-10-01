import type { MetadataRoute } from "next";
import { opengraph_image_path } from "@/lib/landing_metadata";
import { at_origin } from "@/lib/site_origin";

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: at_origin("/"),
    lastModified: new Date("2026-09-30"),
    changeFrequency: "monthly",
    priority: 1,
    images: [at_origin(opengraph_image_path)],
  },
  {
    url: at_origin("/refection"),
    lastModified: new Date("2026-10-01"),
    changeFrequency: "monthly",
    priority: 1,
    images: [at_origin(opengraph_image_path)],
  },
  {
    url: at_origin("/llms.txt"),
    lastModified: new Date("2026-10-01"),
    changeFrequency: "monthly",
    priority: 0.3,
  },
];

export default sitemap;
