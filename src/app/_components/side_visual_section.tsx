import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type side_visual_section_props = {
  children: ReactNode;
  action?: ReactNode;
  visual?: ReactNode;
  visual_side?: "left" | "right";
};

export const SideVisualSection = ({
  children,
  action,
  visual,
  visual_side = "left",
}: side_visual_section_props) => (
  <section
    className={cn(
      "flex min-h-svh flex-col justify-center gap-12 lg:flex-wrap lg:content-center lg:items-start lg:gap-16",
      visual_side === "left"
        ? "lg:flex-row-reverse lg:pr-[min(6%,86px)]"
        : "lg:flex-row lg:pl-[min(6%,86px)]",
    )}
  >
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
