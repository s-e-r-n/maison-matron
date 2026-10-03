import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import logo from "../../../public/brand/maison-matron-logo-complete.svg";
import styles from "./hero.module.css";
import { Quote, SectionSubtitle } from "./typography";

type hero_props = { children: ReactNode };

export const Hero = ({ children }: hero_props) => (
  <section className="relative overflow-hidden bg-ink text-paper">
    <video
      src="/video/maison-matron-hero.mp4"
      poster="/video/maison-matron-hero-poster.avif"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
      className="absolute inset-0 size-full object-cover"
    />
    <div aria-hidden className="absolute inset-0 bg-ink/50" />
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[20%] *:absolute *:inset-0",
        styles.blur,
      )}
    >
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
    <div className="page-width relative flex min-h-svh flex-col justify-between gap-12 pt-5 pb-12 lg:gap-16 lg:py-[min(6%,86px)]">
      <div className="flex justify-center">
        <Image
          src={logo}
          alt="Maison Matron, 1921"
          preload
          className="block h-auto w-[286px] max-w-full brightness-0 invert"
        />
      </div>
      <div className="copy-inset flex flex-col items-start">
        <h1 className="mb-4 font-display text-[36px] leading-[1.06] italic lg:text-[50px]">
          Artisans tapissiers et ébénistes depuis 4 générations
        </h1>
        <div className="mb-4">
          <SectionSubtitle>+20'000 pièces</SectionSubtitle>
          <SectionSubtitle>+5'000 clients</SectionSubtitle>
        </div>
        <div className="w-full md:w-fit md:*:@container-normal">
          <div className="mb-4 border border-paper/50 p-[2px] md:contain-inline-size">
            <div className="border border-paper/50 p-4 backdrop-blur-xs">
              <Quote>
                « Des conseils avisés, une superbe sélection de tissus et un
                savoir-faire minutieux. » - Anne-Claude
              </Quote>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  </section>
);
