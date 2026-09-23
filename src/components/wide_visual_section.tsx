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
  <section className="flex flex-col gap-12 lg:gap-16">
    <div className="copy-inset md:text-center">
      <div className="space-y-4">{children}</div>
      {action && <div className="mt-12 lg:mt-16">{action}</div>}
    </div>
    <div
      aria-hidden={visual ? undefined : true}
      className="*:block *:h-auto *:w-full empty:aspect-[3/2] empty:bg-ink md:mx-4 lg:mx-0"
    >
      {visual}
    </div>
  </section>
);
