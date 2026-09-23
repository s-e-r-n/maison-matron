import type { ReactNode } from "react";

type centered_section_props = { children: ReactNode };

export const CenteredSection = ({ children }: centered_section_props) => (
  <section className="copy-inset flex min-h-[50svh] flex-col justify-center space-y-4 md:items-center md:text-center">
    {children}
  </section>
);
