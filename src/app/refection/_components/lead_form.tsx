"use client";

import {
  createContext,
  type ReactNode,
  type SubmitEvent,
  useActionState,
  useState,
} from "react";
import { type lead_errors, lead_errors_of, valid_lead } from "../_lib/lead";
import { submit_lead } from "../actions";

type submission_state = { status: "idle" } | { status: "failed" };

type lead_form_props = {
  form_id: string;
  children: ReactNode;
  failure: ReactNode;
  className?: string;
};

const initial_state: submission_state = { status: "idle" };

export const LeadErrors = createContext<lead_errors>({});

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
  const [errors, set_errors] = useState<lead_errors>({});
  const hold_invalid_lead = (event: SubmitEvent<HTMLFormElement>) => {
    const form_data = new FormData(event.currentTarget);
    set_errors(lead_errors_of(form_data));
    if (!valid_lead(form_data)) event.preventDefault();
  };
  return (
    <form
      id={form_id}
      action={action}
      onSubmit={hold_invalid_lead}
      noValidate
      className={className}
    >
      <LeadErrors value={errors}>
        <fieldset disabled={pending} className="contents">
          {children}
        </fieldset>
      </LeadErrors>
      {state.status === "failed" && failure}
    </form>
  );
};
