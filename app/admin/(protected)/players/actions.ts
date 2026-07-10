"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addPlayer(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim() || null;
  const jerseyRaw = String(formData.get("jersey_number") ?? "").trim();
  const jersey_number = jerseyRaw ? Number(jerseyRaw) : null;

  if (!name) return;

  await supabase.from("players").insert({ name, position, jersey_number });
  revalidatePath("/admin/players");
  revalidatePath("/squad");
}

export async function updatePlayer(playerId: string, formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim() || null;
  const jerseyRaw = String(formData.get("jersey_number") ?? "").trim();
  const jersey_number = jerseyRaw ? Number(jerseyRaw) : null;
  const bio = String(formData.get("bio") ?? "").trim() || null;

  if (!name) return;

  await supabase
    .from("players")
    .update({ name, position, jersey_number, bio })
    .eq("id", playerId);

  revalidatePath("/admin/players");
  revalidatePath(`/players/${playerId}`);
  revalidatePath("/squad");
  redirect("/admin/players");
}

// Deliberately no hard-delete: match_stats/match_squad reference
// players, and removing a player would erase their historical
// stats from every past match. "Inactive" hides them from the
// public squad list while keeping match history intact.
export async function setPlayerActive(playerId: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("players").update({ active }).eq("id", playerId);
  revalidatePath("/admin/players");
  revalidatePath("/squad");
}
