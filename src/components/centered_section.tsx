import type { ReactNode } from "react";

type centered_section_props = {
  children: ReactNode;
  action?: ReactNode;
};

export const CenteredSection = ({
  children,
  action,
}: centered_section_props) => (
  <section className="copy-inset flex min-h-svh flex-col justify-center md:items-center md:text-center">
    <div className="space-y-4">{children}</div>
    {action && <div className="mt-12 lg:mt-16">{action}</div>}
  </section>
);
