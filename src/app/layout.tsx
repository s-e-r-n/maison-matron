import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { Suspense } from "react";
import { PageView } from "@/components/page_view";
import "./globals.css";

const ebGaramond = EB_Garamond({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const metadata: Metadata = {
  title: "scaffold-nextjs-meta",
  description:
    "Next.js 16 scaffold with the Meta Conversions API, GoHighLevel and Nodemailer modules",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className={ebGaramond.variable}>
    <body>
      {children}
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
    </body>
  </html>
);

export default RootLayout;
