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
  <section className="flex min-h-svh flex-col justify-center gap-12 lg:gap-16">
    <div className="copy-inset md:text-center">
      <div className="space-y-4 xl:whitespace-nowrap">{children}</div>
      {action && <div className="mt-8 lg:mt-12">{action}</div>}
    </div>
    <div
      aria-hidden={visual ? undefined : true}
      className="grid empty:aspect-[3/2] empty:bg-ink [&_img]:block [&_img]:h-auto [&_img]:w-full md:mx-4 lg:mx-0"
    >
      {visual}
    </div>
  </section>
);
