import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { site_origin } from "@/lib/site_origin";
import { structured_data_json } from "@/lib/structured_data";
import "./globals.css";

const ebGaramond = EB_Garamond({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

const title = "Expertise offerte | Tapissier Ébénistes Depuis 4 Générations";
const description =
  "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations";

export const metadata: Metadata = {
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

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="fr"
    data-scroll-behavior="smooth"
    className={`${ebGaramond.variable} scroll-smooth`}
  >
    <body className="bg-paper font-sans text-base leading-[1.35] text-ink antialiased">
      {children}
      <script type="application/ld+json">{structured_data_json}</script>
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
