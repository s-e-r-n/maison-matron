import type { Metadata } from "next";
import { Suspense } from "react";
import { PageView } from "@/components/page_view";
import "./globals.css";

export const metadata: Metadata = {
  title: "scaffold-nextjs-meta",
  description:
    "Next.js 16 scaffold with the Meta Conversions API, GoHighLevel and Nodemailer modules",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en">
    <body>
      {children}
      <Suspense fallback={null}>
        <PageView />
      </Suspense>
    </body>
  </html>
);

export default RootLayout;
