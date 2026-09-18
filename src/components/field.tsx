import { useId } from "react";
import type { dictionary_key } from "@/lib/form_contract/dictionary";

type input_key = Exclude<dictionary_key, "freetext">;

type input_attributes = {
  type: "email" | "tel" | "text";
  autoComplete: string;
  inputMode?: "email" | "tel";
  autoCapitalize?: "words" | "characters";
};

const attributes: Record<input_key, input_attributes> = {
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
};

const freetext_rows = 4;

type field_props = {
  name: dictionary_key;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

export const Field = ({
  name,
  label,
  placeholder,
  required,
  className,
}: field_props) => {
  const id = useId();
  return (
    <label htmlFor={id} className={className}>
      <span>{label}</span>
      {name === "freetext" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={freetext_rows}
        />
      ) : (
        <input
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          spellCheck={false}
          {...attributes[name]}
        />
      )}
    </label>
  );
};
