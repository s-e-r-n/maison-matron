import type { ReactNode } from "react";

type centered_section_props = { children: ReactNode };

export const CenteredSection = ({ children }: centered_section_props) => (
  <section className="copy-inset space-y-4 text-center">{children}</section>
);
