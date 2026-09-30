import type { SubmitEvent } from "react";

export const hold_submission = (event: SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
};
