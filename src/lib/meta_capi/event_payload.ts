import "server-only";
import type { event_name } from "./event_dictionary";
import { sha256_hex } from "./sha256";
import type { user_data } from "./user_data_keys";

export type server_event = {
  event_name: event_name;
  event_time: number;
  event_id: string;
  action_source: "website";
  event_source_url?: string;
  referrer_url?: string;
  user_data: user_data;
};

type event_input = {
  event_name: event_name;
  event_time_ms: number;
  event_source_url?: string;
  referrer_url?: string;
  user_data: user_data;
};

const action_source: "website" = "website";

const present_urls = ({ event_source_url, referrer_url }: event_input) => ({
  ...(event_source_url ? { event_source_url } : {}),
  ...(referrer_url ? { referrer_url } : {}),
});

const event_id_of = (
  event: Omit<server_event, "event_id">,
  event_time_ms: number,
) =>
  sha256_hex(
    [
      event.event_name,
      event.user_data.external_id ?? "",
      event_time_ms,
      sha256_hex(JSON.stringify(event)),
    ].join("|"),
  );

export const build_server_event = (input: event_input): server_event => {
  const event = {
    event_name: input.event_name,
    event_time: Math.floor(input.event_time_ms / 1000),
    action_source,
    ...present_urls(input),
    user_data: input.user_data,
  };
  return { ...event, event_id: event_id_of(event, input.event_time_ms) };
};
