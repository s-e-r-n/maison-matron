import { useId } from "react";
import type { dictionary_key } from "@/lib/form_contract/dictionary";

type input_attributes = {
  type: "email" | "tel" | "text";
  autoComplete: string;
  inputMode?: "email" | "tel";
  autoCapitalize?: "words" | "characters" | "sentences";
};

const attributes: Record<dictionary_key, input_attributes> = {
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
  name: dictionary_key;
  label: string;
  className?: string;
};

export const Field = ({ name, label, className }: field_props) => {
  const id = useId();
  return (
    <div className={className}>
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
        className="block w-full appearance-none rounded-none border-0 border-b border-sheet-rule bg-transparent p-0 pb-1 font-sans text-base leading-none text-sheet-ink focus:outline-none focus-visible:border-ink"
        {...attributes[name]}
      />
    </div>
  );
};
