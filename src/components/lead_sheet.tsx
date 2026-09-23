import Image from "next/image";
import type { ReactNode } from "react";
import { LeadForm } from "@/components/lead_form";
import { cn } from "@/lib/utils";
import logo from "../../public/brand/maison-matron-logo-complete.svg";
import styles from "./lead_sheet.module.css";

type lead_sheet_props = {
  id: string;
  title: ReactNode;
  send: string;
  children: ReactNode;
};

export const LeadSheet = ({ id, title, send, children }: lead_sheet_props) => (
  <section id={id} className="flex flex-col gap-12 lg:gap-16 lg:pt-4">
    <hr className="copy-inset h-px border-0 bg-[image:repeating-linear-gradient(to_right,rgb(0_0_0/0.5)_0_6px,transparent_6px_10px)] bg-clip-content" />
    <div className="copy-inset md:text-center">{title}</div>
    <div
      className={cn(
        styles.panel,
        "mx-auto w-full lg:w-[calc(var(--sheet-width)+144px)] lg:max-w-full lg:bg-panel lg:px-18 lg:py-7",
      )}
    >
      <LeadForm
        className={cn(
          styles.paper,
          "@container mx-auto flex aspect-[210/297] min-h-svh w-full bg-sheet text-sheet-ink lg:aspect-auto lg:h-(--sheet-height) lg:min-h-0 lg:w-(--sheet-width) lg:max-w-full",
        )}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center px-[9.5cqi] py-[6cqi]">
          <Image
            src={logo}
            alt="Maison Matron"
            className="mx-auto block h-auto w-[184px] max-w-full opacity-70"
          />
          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-7 md:mt-[106px] md:grid-cols-2 md:gap-y-10">
            {children}
          </div>
          <div className="pt-10 md:pt-[106px]">
            <button
              type="submit"
              className="mx-auto block border border-secondary p-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <span className="flex h-[46px] w-[176px] items-center justify-center bg-secondary px-8 py-[13px] font-display text-[17px] leading-[19px] whitespace-nowrap text-white italic">
                {send}
              </span>
            </button>
          </div>
        </div>
      </LeadForm>
    </div>
  </section>
);
