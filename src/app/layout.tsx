import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { EB_Garamond } from "next/font/google";
import { site_origin } from "@/lib/site_origin";
import "./globals.css";

const ebGaramond = EB_Garamond({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  metadataBase: site_origin,
  title: {
    default: "Maison Matron, artisan tapissier & ébéniste depuis 4 générations",
    template: "%s · Maison Matron",
  },
  description:
    "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="fr-CH"
    data-scroll-behavior="smooth"
    className={`${ebGaramond.variable} scroll-smooth`}
  >
    <body className="bg-paper font-sans text-base leading-[1.35] text-ink antialiased">
      {children}
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
