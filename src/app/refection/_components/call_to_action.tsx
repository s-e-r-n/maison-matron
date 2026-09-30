import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./call_to_action.module.css";

type tone = "principal" | "secondary";

type face_props = { children: ReactNode; tone: tone };

const Face = ({ children, tone }: face_props) => (
  <span
    className={cn(
      "flex items-center justify-center text-center font-display text-white italic",
      styles.face,
      tone === "principal" ? "bg-principal" : "bg-secondary",
    )}
  >
    {children}
  </span>
);

const frame = (tone: tone) =>
  cn(
    "inline-block max-w-full border p-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current",
    tone === "principal" ? "border-principal" : "border-secondary",
  );

type call_to_action_props = {
  children: ReactNode;
  href?: `#${string}` | `tel:${string}`;
  tone?: tone;
};

export const CallToAction = ({
  children,
  href,
  tone = "principal",
}: call_to_action_props) =>
  href ? (
    <a href={href} className={frame(tone)}>
      <Face tone={tone}>{children}</Face>
    </a>
  ) : (
    <button type="submit" className={frame(tone)}>
      <Face tone={tone}>{children}</Face>
    </button>
  );

type call_to_actions_props = { children: ReactNode };

export const CallToActions = ({ children }: call_to_actions_props) => (
  <div className="@container w-full">
    <div
      className={cn("flex max-md:justify-center md:inline-flex", styles.row)}
    >
      {children}
    </div>
  </div>
);

type details_props = { children: ReactNode };

export const CallToActionDetails = ({ children }: details_props) => (
  <div className="mt-3 text-[13px] max-md:mx-auto max-md:w-fit">
    <ul className="inline-flex list-inside list-['❊_'] flex-wrap gap-x-1 text-left align-top max-md:justify-center">
      {children}
    </ul>
  </div>
);

export const CallToActionDetail = ({ children }: details_props) => (
  <li className="marker:text-gray-500 first:list-none">
    <small className="text-[1em] text-gray-500">{children}</small>
  </li>
);
