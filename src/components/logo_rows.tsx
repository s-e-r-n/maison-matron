import type { ReactNode } from "react";

type logo_rows_props = { children: ReactNode };

export const LogoRows = ({ children }: logo_rows_props) => (
  <div className="@container my-12 flex flex-col gap-6 lg:my-16 [&_img]:h-[26px] [&_img]:w-auto [&_img]:max-w-[150px] [&_img]:object-contain [&_img]:opacity-50 lg:[&_img]:h-[min(26px,calc(100cqw*26/772))] lg:[&_img]:max-w-[min(150px,calc(100cqw*150/772))]">
    {children}
  </div>
);

export const LogoRow = ({ children }: logo_rows_props) => (
  <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:justify-between lg:gap-x-[min(40px,calc(100cqw*40/772))]">
    {children}
  </div>
);
