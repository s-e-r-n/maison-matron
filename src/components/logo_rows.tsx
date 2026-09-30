import type { ReactNode } from "react";

type logo_rows_props = { children: ReactNode };

export const LogoRows = ({ children }: logo_rows_props) => (
  <div className="@container my-12 lg:my-16">
    <div className="flex flex-col gap-6 max-md:flex-row max-md:flex-wrap max-md:items-center max-md:justify-center max-md:gap-x-[min(40px,calc(100cqw*40/650))] max-md:gap-y-[min(12px,calc(100cqw*12/650))] [&_img]:h-[26px] [&_img]:w-auto [&_img]:max-w-[150px] [&_img]:object-contain [&_img]:opacity-50 max-md:[&_img]:h-[min(26px,calc(100cqw*26/650))] max-md:[&_img]:max-w-[min(150px,calc(100cqw*150/650))] lg:[&_img]:h-[min(26px,calc(100cqw*26/772))] lg:[&_img]:max-w-[min(150px,calc(100cqw*150/772))]">
      {children}
    </div>
  </div>
);

export const LogoRow = ({ children }: logo_rows_props) => (
  <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 max-md:contents lg:justify-between lg:gap-x-[min(40px,calc(100cqw*40/772))]">
    {children}
  </div>
);

export const MobileRowBreak = () => <span className="basis-full md:hidden" />;
