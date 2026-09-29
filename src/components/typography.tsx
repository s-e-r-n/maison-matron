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

export const Caption = ({ children }: typography_props) => (
  <figcaption className="mx-[15px] mt-2 px-5 font-display text-base leading-none text-sheet-ink italic md:mx-0 md:px-0">
    {children}
  </figcaption>
);

export const Quote = ({ children }: typography_props) => (
  <p className="text-[17px] leading-[1.45]">{children}</p>
);
