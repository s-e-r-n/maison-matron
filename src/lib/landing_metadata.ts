import type { Metadata } from "next";
import { site_origin } from "@/lib/site_origin";

const title = "Expertise offerte | Tapissier Ébéniste Depuis 4 Générations";
const description =
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Examen de votre mobilier ❊ Devis";

export const landing_metadata: Metadata = {
  metadataBase: site_origin,
  title,
  description,
  applicationName: "Maison Matron",
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: "Maison Matron",
    title,
    description,
    images: {
      url: "/opengraph-canape-lions.jpg",
      width: 2400,
      height: 1260,
      type: "image/jpeg",
      alt: "Canapé en bois aux accoudoirs sculptés de têtes de lion, garni d'un tissu orangé à rayures ivoire, sur fond blanc.",
    },
  },
  twitter: { card: "summary_large_image" },
  robots: {
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};
