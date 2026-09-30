import type { Metadata } from "next";
import { site_origin } from "@/lib/site_origin";

const title = "Expertise offerte | Tapissier Ébéniste Depuis 4 Générations";
const description =
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations";

export const landing_metadata: Metadata = {
  metadataBase: site_origin,
  title,
  description,
  applicationName: "Maison Matron",
  openGraph: {
    type: "website",
    siteName: "Maison Matron",
    title,
    description,
    images: {
      url: "/home/visuals/5-chaises.jpg",
      width: 2700,
      height: 1800,
      alt: "Une petite chaise laquée blanc au dossier enroulé et quatre chaises traîneau en bois, garnies d'un même tissu bleu à motif de cercles, sur fond blanc.",
    },
  },
  twitter: { card: "summary_large_image" },
  robots: {
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
