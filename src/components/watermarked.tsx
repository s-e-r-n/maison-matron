import Image from "next/image";
import type { ReactNode } from "react";
import watermark from "../../public/brand/maison-matron-watermark.svg";

type watermarked_props = { children: ReactNode };

export const Watermarked = ({ children }: watermarked_props) => (
  <div className="relative [--gutter-width:calc(100vh*8.71/104.39)]">
    <div
      aria-hidden="true"
      className="absolute inset-y-0 right-[1%] hidden w-(--gutter-width) lg:block"
    >
      <div className="sticky top-0 h-screen">
        <Image
          src={watermark}
          alt=""
          className="absolute right-0 bottom-full h-auto max-h-none w-[100vh] max-w-none origin-bottom-right -rotate-90"
        />
      </div>
    </div>
    <div className="lg:me-[calc(1%+var(--gutter-width)+48px)]">{children}</div>
  </div>
);
