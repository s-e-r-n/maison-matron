"use client";

import type { ReactNode } from "react";
import { hold_submission } from "@/lib/submission";

type lead_form_props = {
  children: ReactNode;
  className?: string;
};

export const LeadForm = ({ children, className }: lead_form_props) => (
  <form onSubmit={hold_submission} className={className}>
    {children}
  </form>
);
