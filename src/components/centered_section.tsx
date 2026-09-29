import type { ReactNode } from "react";

type centered_section_props = { children: ReactNode };

export const CenteredSection = ({ children }: centered_section_props) => (
  <section className="copy-inset flex min-h-svh flex-col justify-center md:items-center md:text-center">
    <div className="space-y-4">{children}</div>
  </section>
);
