import type { ReactNode } from "react";

type reviews_section_props = {
  title: ReactNode;
  children: ReactNode;
  action: ReactNode;
};

export const ReviewsSection = ({
  title,
  children,
  action,
}: reviews_section_props) => (
  <section className="copy-inset flex min-h-svh flex-col justify-center">
    <div className="md:mx-auto md:w-full md:max-w-[600px] lg:max-w-[1100px]">
      {title}
      <div className="mt-12 lg:mt-16 lg:columns-2 lg:gap-16 [&>figure]:mb-12 [&>figure]:break-inside-avoid lg:[&>figure]:mb-16 [&>figure:last-child]:mb-0">
        {children}
      </div>
      <div className="mt-8 lg:mt-12">{action}</div>
    </div>
  </section>
);
