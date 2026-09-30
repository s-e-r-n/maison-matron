import type { Metadata } from "next";
import NotFound from "next/dist/client/components/builtin/not-found";
import { EB_Garamond } from "next/font/google";
import "./global-not-found.css";

const ebGaramond = EB_Garamond({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "Maison Matron",
  description:
    "Maison Matron, artisans tapissiers et ébénistes depuis 4 générations",
};

const GlobalNotFound = () => (
  <html
    lang="fr"
    data-scroll-behavior="smooth"
    className={`${ebGaramond.variable} scroll-smooth`}
  >
    <body className="bg-paper font-sans text-base leading-[1.35] text-ink antialiased">
      <NotFound />
    </body>
  </html>
);

export default GlobalNotFound;
