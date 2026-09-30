import type { ReactNode } from "react";

type side_visual_section_props = {
  children: ReactNode;
  action?: ReactNode;
  visual?: ReactNode;
};

export const SideVisualSection = ({
  children,
  action,
  visual,
}: side_visual_section_props) => (
  <section className="flex min-h-svh flex-col justify-center gap-12 lg:flex-row-reverse lg:flex-wrap lg:content-center lg:items-start lg:gap-16 lg:pr-[min(6%,86px)]">
    <div className="mx-[15px] px-5 lg:mx-0 lg:min-w-0 lg:flex-1 lg:px-0">
      <div className="space-y-4">{children}</div>
      {action && <div className="mt-8 lg:mt-12">{action}</div>}
    </div>
    <div
      aria-hidden={visual ? undefined : true}
      className="empty:aspect-[4/5] empty:bg-ink [&_img]:block [&_img]:h-auto [&_img]:w-full md:mx-4 lg:mx-0 lg:min-w-0 lg:flex-1"
    >
      {visual}
    </div>
  </section>
);
