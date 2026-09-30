"use server";

import { redirect } from "next/navigation";
import { deliver_to_ghl } from "@/lib/ghl/deliver";
import { send_confirmation } from "@/lib/mail/send";
import { capture } from "@/lib/meta_capi/capture";
import { lead_submission_allowed } from "@/lib/rate_limit/submission_limit";
import { dispatch_to_whatsapp } from "@/lib/whatsapp_dispatch/dispatch";

export const submit_lead = async (
  form_id: string,
  form_data: FormData,
): Promise<{ status: "failed" }> => {
  if (!(await lead_submission_allowed())) return { status: "failed" };
  const dispatch = dispatch_to_whatsapp(form_data, form_id);
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  await dispatch;
  if (!confirmation.ok) return { status: "failed" };
  redirect("/confirmation");
};
