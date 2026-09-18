import "server-only";
import { after } from "next/server";
import { form_fields_of } from "@/lib/form_contract/form_fields";
import { type mail_config, read_config } from "./config";
import { type mail_fields, mail_table } from "./form_table";
import type { mail_result } from "./mail_result";
import { confirmation_message, copy_message } from "./messages";
import { send_message } from "./smtp";

const copy_after_response = (fields: mail_fields, config: mail_config) => {
  after(async () => {
    const result = await send_message(copy_message(fields, config), config);
    if (!result.ok)
      console.warn(`mail: copy ${result.code}: ${result.message}`);
  });
};

export const send_confirmation = async (
  form_data: FormData,
): Promise<mail_result> => {
  const config = read_config();
  if (!config.ok) return config;
  const fields = form_fields_of(form_data, mail_table);
  copy_after_response(fields, config.config);
  const email = fields.email;
  if (!email) {
    return {
      ok: false,
      code: "refused",
      message: "the submission carries no email",
    };
  }
  const result = await send_message(
    confirmation_message({ ...fields, email }, config.config),
    config.config,
  );
  if (!result.ok) {
    console.warn(`mail: confirmation ${result.code}: ${result.message}`);
  }
  return result;
};
