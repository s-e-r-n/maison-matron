import type { ReactNode } from "react";

type centered_section_props = { children: ReactNode };

export const CenteredSection = ({ children }: centered_section_props) => (
  <section className="copy-inset flex min-h-[50svh] flex-col items-center justify-center space-y-4 text-center">
    {children}
  </section>
);
