import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type frame_props = { children: ReactNode; className?: string };

export const Frame = ({ children, className }: frame_props) => (
  <div className={cn("border border-paper/50 p-[2px]", className)}>
    <div className="border border-paper/50 p-4 backdrop-blur-xs">
      {children}
    </div>
  </div>
);
