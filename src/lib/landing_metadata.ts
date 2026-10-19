import type { Metadata } from "next";

const title = "Maison Matron | La Haute Couture, pour vos meubles";
const description =
  "Nous transformons vos meubles en pièces uniques au monde. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Évaluation de votre mobilier";

export const opengraph_image_path = "/opengraph-velours-gene.jpg";

const opengraph_image = {
  url: opengraph_image_path,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Gros plan d'un velours de Gênes à motif floral : roses et boutons rose corail, feuillage vert sombre en relief, sur fond blanc.",
};

export const landing_metadata = (pathname: "/"): Metadata => ({
  title: { absolute: title },
  description,
  applicationName: "Maison Matron",
  alternates: { canonical: pathname },
  openGraph: {
    type: "website",
    url: pathname,
    locale: "fr_CH",
    siteName: "Maison Matron",
    title,
    description,
    images: opengraph_image,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: opengraph_image,
  },
  robots: {
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
});
