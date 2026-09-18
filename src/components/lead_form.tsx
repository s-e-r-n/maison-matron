"use client";

import { type ReactNode, useActionState } from "react";
import { submit_lead } from "@/app/actions";

type submission_state = { status: "idle" } | { status: "failed" };

type lead_form_props = {
  children: ReactNode;
  failure: ReactNode;
  className?: string;
};

const initial_state: submission_state = { status: "idle" };

const submit = (
  _state: submission_state,
  form_data: FormData,
): Promise<submission_state> => submit_lead(form_data);

export const LeadForm = ({ children, failure, className }: lead_form_props) => {
  const [state, action, pending] = useActionState(submit, initial_state);
  return (
    <form action={action} className={className}>
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {state.status === "failed" && failure}
    </form>
  );
};
