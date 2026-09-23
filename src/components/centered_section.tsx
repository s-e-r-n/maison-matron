import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type centered_section_props = { children: ReactNode; className?: string };

export const CenteredSection = ({
  children,
  className,
}: centered_section_props) => (
  <section className={cn("copy-inset space-y-4 text-center", className)}>
    {children}
  </section>
);
