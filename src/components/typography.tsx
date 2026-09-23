import type { ReactNode } from "react";

type typography_props = { children: ReactNode };

export const SectionTitle = ({ children }: typography_props) => (
  <h2 className="font-display text-[30px] leading-[1.1] italic lg:text-[36px]">
    {children}
  </h2>
);

export const SectionSubtitle = ({ children }: typography_props) => (
  <p className="font-display text-[22px] leading-[1.2] italic lg:text-[28px]">
    {children}
  </p>
);
