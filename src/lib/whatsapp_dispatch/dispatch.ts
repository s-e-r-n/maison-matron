import "server-only";
import { send_template, type transport } from "./cloud_api";
import { read_config } from "./config";
import type {
  dispatch_failure,
  dispatch_result,
  send_result,
} from "./dispatch_result";

const next_entry_prefix = "$ACTION_";

const form_values = (form_data: FormData) =>
  Array.from(form_data)
    .filter(([name]) => !name.startsWith(next_entry_prefix))
    .map(([, value]) => value)
    .filter((value): value is string => typeof value === "string");

const flatten = (value: string) => value.trim().replace(/\s*[\r\n]\s*/g, " ");

const report_config = (failure: dispatch_failure) => {
  if (failure.code === "misconfigured") {
    console.warn(`whatsapp: misconfigured: ${failure.message}`);
  }
  return failure;
};

const settled_send = (
  outcome: PromiseSettledResult<send_result>,
): send_result =>
  outcome.status === "fulfilled"
    ? outcome.value
    : {
        ok: false,
        code: "unreachable",
        message: `the send rejected: ${String(outcome.reason)}`,
      };

const report = (sends: send_result[]): dispatch_result => {
  for (const send of sends) {
    if (!send.ok) console.warn(`whatsapp: ${send.code}: ${send.message}`);
  }
  return { ok: true, sends };
};

export const dispatch_to_whatsapp = async (
  form_data: FormData,
  form_id: string,
  overrides: Partial<transport> = {},
): Promise<dispatch_result> => {
  const config = read_config();
  if (!config.ok) return report_config(config);
  const values = [...form_values(form_data), form_id].map(flatten);
  const settled = await Promise.allSettled(
    config.config.recipients.map((to) =>
      send_template(to, values, config.config, overrides),
    ),
  );
  return report(settled.map(settled_send));
};
