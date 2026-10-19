import type { ReactNode } from "react";

type logo_grid_props = { children: ReactNode };

export const LogoGrid = ({ children }: logo_grid_props) => (
  <div className="my-12 grid grid-cols-2 place-items-center gap-x-8 gap-y-10 lg:my-16 [&_img]:h-auto [&_img]:opacity-50">
    {children}
  </div>
);
