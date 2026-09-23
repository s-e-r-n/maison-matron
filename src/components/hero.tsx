import Image from "next/image";
import type { ReactNode } from "react";
import logo from "../../public/brand/maison-matron-logo-complete.svg";

type hero_props = {
  lead: string;
  title: string;
  quote: string;
  signature: string;
  children: ReactNode;
};

export const Hero = ({
  lead,
  title,
  quote,
  signature,
  children,
}: hero_props) => (
  <section className="page-width py-12 lg:py-16">
    <div className="flex flex-col gap-12 lg:grid lg:grid-cols-1 lg:gap-0">
      <div className="mx-4 flex aspect-video items-start justify-center bg-ink pt-5 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:pt-[min(6%,86px)]">
        <Image
          src={logo}
          alt="Maison Matron, 1921"
          preload
          className="block h-auto w-[286px] max-w-full brightness-0 invert"
        />
      </div>
      <div className="copy-inset flex flex-col items-start lg:z-10 lg:col-start-1 lg:row-start-1 lg:justify-end lg:self-stretch lg:p-[min(6%,86px)] lg:text-paper">
        <h1 className="mb-4 font-display text-[26px] leading-[1.06] italic lg:text-[36px]">
          <span className="lg:block">{lead}</span> {title}
        </h1>
        <div className="mb-12 space-y-4 lg:mb-16">
          <p className="text-[17px] leading-[1.45] lg:max-w-[400px]">{quote}</p>
          <p className="leading-[1.5]">{signature}</p>
        </div>
        {children}
      </div>
    </div>
  </section>
);
