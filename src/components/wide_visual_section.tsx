import type { ReactNode } from "react";

type wide_visual_section_props = {
  children: ReactNode;
  action?: ReactNode;
  visual?: ReactNode;
};

export const WideVisualSection = ({
  children,
  action,
  visual,
}: wide_visual_section_props) => (
  <section className="flex flex-col gap-8 lg:gap-10">
    <div className="copy-inset space-y-4 md:text-center">{children}</div>
    <div
      aria-hidden={visual ? undefined : true}
      className="grid *:h-auto *:w-full empty:aspect-[3/2] empty:bg-ink md:mx-4 lg:mx-0"
    >
      {visual}
    </div>
    {action && <div className="copy-inset md:text-center">{action}</div>}
  </section>
);
