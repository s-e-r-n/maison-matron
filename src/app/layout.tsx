import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

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

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="fr" className={ebGaramond.variable}>
    <body className="bg-paper font-sans text-base leading-[1.35] text-ink antialiased">
      {children}
    </body>
  </html>
);

export default RootLayout;
