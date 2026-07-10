"use server";

import { createClient } from "@/lib/supabase/server";

export type SubmitJoinState = { ok: boolean; error?: string };

export async function submitJoinRequest(
  _prev: SubmitJoinState,
  formData: FormData
): Promise<SubmitJoinState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !contact) {
    return { ok: false, error: "Name and a way to reach you are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("join_requests")
    .insert({ name, contact, message: message || null });

  if (error) {
    return { ok: false, error: "Something went wrong — please try again." };
  }

  return { ok: true };
}
