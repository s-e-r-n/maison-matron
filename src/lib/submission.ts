import type { FormEvent } from "react";

export const hold_submission = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};
