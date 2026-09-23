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
  <section className="flex flex-col gap-12 lg:flex-row-reverse lg:items-start lg:gap-16 lg:pr-[min(6%,86px)]">
    <div className="mx-[15px] px-5 lg:mx-0 lg:min-w-0 lg:flex-1 lg:px-0">
      <div className="space-y-4">{children}</div>
      {action && <div className="mt-12 lg:mt-16">{action}</div>}
    </div>
    <div
      aria-hidden={visual ? undefined : true}
      className="mx-4 aspect-[4/5] overflow-hidden bg-ink *:size-full *:object-cover lg:mx-0 lg:min-w-0 lg:flex-1"
    >
      {visual}
    </div>
  </section>
);
