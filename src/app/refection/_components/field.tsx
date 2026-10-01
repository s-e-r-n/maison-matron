"use client";

import { use, useId } from "react";
import { cn } from "@/lib/utils";
import { LeadErrors } from "./lead_form";

type input_attributes = {
  type: "email" | "tel" | "text";
  autoComplete: string;
  inputMode?: "email" | "tel";
  autoCapitalize?: "words" | "characters" | "sentences";
};

type field_name =
  | "given-name"
  | "family-name"
  | "email"
  | "tel"
  | "organization"
  | "postal-code"
  | "address-level2"
  | "freetext";

const attributes: Record<field_name, input_attributes> = {
  "given-name": {
    type: "text",
    autoComplete: "given-name",
    autoCapitalize: "words",
  },
  "family-name": {
    type: "text",
    autoComplete: "family-name",
    autoCapitalize: "words",
  },
  email: { type: "email", autoComplete: "email", inputMode: "email" },
  tel: { type: "tel", autoComplete: "tel", inputMode: "tel" },
  organization: {
    type: "text",
    autoComplete: "organization",
    autoCapitalize: "words",
  },
  "postal-code": {
    type: "text",
    autoComplete: "postal-code",
    autoCapitalize: "characters",
  },
  "address-level2": {
    type: "text",
    autoComplete: "address-level2",
    autoCapitalize: "words",
  },
  freetext: { type: "text", autoComplete: "off", autoCapitalize: "sentences" },
};

type field_props = {
  name: field_name;
  label: string;
  className?: string;
};

export const Field = ({ name, label, className }: field_props) => {
  const id = useId();
  const error_id = `${id}-error`;
  const errors: Partial<Record<field_name, string>> = use(LeadErrors);
  const error = errors[name];
  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="mb-[2px] block font-display text-base leading-none text-sheet-ink italic"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        spellCheck={false}
        aria-invalid={error !== undefined}
        aria-describedby={error === undefined ? undefined : error_id}
        className="block w-full appearance-none rounded-none border-0 border-b border-sheet-rule bg-transparent p-0 pb-1 font-sans text-base leading-none text-sheet-ink focus:outline-none focus-visible:border-ink"
        {...attributes[name]}
      />
      {error !== undefined && (
        <span
          id={error_id}
          className="absolute top-full left-0 mt-1 block font-sans text-[13px] leading-4 text-red-400"
        >
          {error}
        </span>
      )}
    </div>
  );
};
