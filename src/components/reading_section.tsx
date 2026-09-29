import type { ReactNode } from "react";

type reading_section_props = { children: ReactNode };

export const ReadingSection = ({ children }: reading_section_props) => (
  <section className="copy-inset flex min-h-svh flex-col justify-center">
    <div className="space-y-12 md:mx-auto md:w-full md:max-w-[600px] lg:space-y-16">
      {children}
    </div>
  </section>
);
