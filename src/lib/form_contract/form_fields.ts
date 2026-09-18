import type { dictionary_key } from "./dictionary";

export type form_fields<K extends string> = Partial<Record<K, string>>;

const values_separator = "\n\n";

const non_blank_strings = (entries: FormDataEntryValue[]) =>
  entries
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((value) => value.length > 0);

export const form_fields_of = <K extends string>(
  form_data: FormData,
  table: Record<K, dictionary_key>,
): form_fields<K> => {
  const fields: form_fields<K> = {};
  for (const key in table) {
    const values = non_blank_strings(form_data.getAll(table[key]));
    if (values.length > 0) fields[key] = values.join(values_separator);
  }
  return fields;
};
