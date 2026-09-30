"use client";

import { type ReactNode, useActionState } from "react";
import { submit_lead } from "../actions";

type submission_state = { status: "idle" } | { status: "failed" };

type lead_form_props = {
  form_id: string;
  children: ReactNode;
  failure: ReactNode;
  className?: string;
};

const initial_state: submission_state = { status: "idle" };

export const LeadForm = ({
  form_id,
  children,
  failure,
  className,
}: lead_form_props) => {
  const submit_lead_of_form = submit_lead.bind(null, form_id);
  const submit = (
    _state: submission_state,
    form_data: FormData,
  ): Promise<submission_state> => submit_lead_of_form(form_data);
  const [state, action, pending] = useActionState(submit, initial_state);
  return (
    <form id={form_id} action={action} className={className}>
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      {state.status === "failed" && failure}
    </form>
  );
};
