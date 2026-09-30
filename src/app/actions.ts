"use server";

import { redirect } from "next/navigation";
import { deliver_to_ghl } from "@/lib/ghl/deliver";
import { send_confirmation } from "@/lib/mail/send";
import { capture } from "@/lib/meta_capi/capture";

export const submit_lead = async (
  form_data: FormData,
): Promise<{ status: "failed" }> => {
  await capture("Lead", form_data);
  deliver_to_ghl(form_data);
  const confirmation = await send_confirmation(form_data);
  if (!confirmation.ok) return { status: "failed" };
  redirect("/confirmation");
};
