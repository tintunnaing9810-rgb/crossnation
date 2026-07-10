"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLAYER_BADGES } from "@/lib/badges";
import type { PlayerStatus } from "@/lib/types";

const BADGE_KEYS = PLAYER_BADGES.map((b) => b.key) as string[];
const STATUS_VALUES: PlayerStatus[] = ["regular", "irregular", "inactive"];

// Normalises the badge field: empty string -> null, and anything not a
// known badge key is rejected (kept as null) so bad input can't slip in.
function parseBadge(raw: FormData) {
  const badge = String(raw.get("badge") ?? "").trim();
  return badge && BADGE_KEYS.includes(badge) ? badge : null;
}

function parseStatus(raw: FormData): PlayerStatus {
  const status = String(raw.get("status") ?? "").trim();
  return (STATUS_VALUES as string[]).includes(status)
    ? (status as PlayerStatus)
    : "regular";
}

export async function addPlayer(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim() || null;
  const jerseyRaw = String(formData.get("jersey_number") ?? "").trim();
  const jersey_number = jerseyRaw ? Number(jerseyRaw) : null;
  const badge = parseBadge(formData);

  if (!name) return;

  await supabase
    .from("players")
    .insert({ name, position, jersey_number, badge });
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
  const badge = parseBadge(formData);
  const status = parseStatus(formData);

  if (!name) return;

  await supabase
    .from("players")
    .update({ name, position, jersey_number, bio, badge, status })
    .eq("id", playerId);

  revalidatePath("/admin/players");
  revalidatePath(`/players/${playerId}`);
  revalidatePath("/squad");
  redirect("/admin/players");
}

// Deliberately no hard-delete: match_stats/match_squad reference
// players, and removing a player would erase their historical stats.
// "Inactive" keeps them on the public squad (greyed out) with their
// match history intact, but takes them out of the squad picker.
export async function setPlayerStatus(playerId: string, status: PlayerStatus) {
  const supabase = await createClient();
  await supabase.from("players").update({ status }).eq("id", playerId);
  revalidatePath("/admin/players");
  revalidatePath("/squad");
}
