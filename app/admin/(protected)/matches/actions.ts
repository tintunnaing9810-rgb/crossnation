"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createMatch(formData: FormData) {
  const supabase = await createClient();
  const match_type =
    String(formData.get("match_type") ?? "internal") === "friendly"
      ? "friendly"
      : "internal";
  let opponent = String(formData.get("opponent") ?? "").trim();
  const match_date = String(formData.get("match_date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim() || null;
  const home_away = String(formData.get("home_away") ?? "home");

  // A friendly needs a named opponent; an internal match day can be
  // logged without a label and gets a sensible default.
  if (!opponent) {
    if (match_type === "friendly") return;
    opponent = "Internal match day";
  }
  if (!match_date) return;

  const { data, error } = await supabase
    .from("matches")
    .insert({ opponent, match_type, match_date, venue, home_away, status: "upcoming" })
    .select("id")
    .single();

  revalidatePath("/admin/matches");
  revalidatePath("/");

  if (!error && data) {
    redirect(`/admin/matches/${data.id}`);
  }
}

// Deletes a match entirely — used to remove fixtures created by
// mistake. The match_squad and match_stats rows are removed too via
// the ON DELETE CASCADE foreign keys in schema.sql, so no orphan data
// is left behind and player totals recompute automatically.
export async function deleteMatch(matchId: string) {
  const supabase = await createClient();
  await supabase.from("matches").delete().eq("id", matchId);

  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/results");
}

// Sets which players are announced for this match. Upserts one
// match_squad row per active player so re-visiting this page later
// shows the previous selection.
export async function setSquad(matchId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: activePlayers } = await supabase
    .from("players")
    .select("id")
    .neq("status", "inactive");

  const rows = (activePlayers ?? []).map((p) => ({
    match_id: matchId,
    player_id: p.id,
    selected: formData.get(`selected_${p.id}`) === "on",
    started: false,
  }));

  if (rows.length > 0) {
    await supabase
      .from("match_squad")
      .upsert(rows, { onConflict: "match_id,player_id" });
  }

  revalidatePath(`/admin/matches/${matchId}`);
  revalidatePath("/");
  redirect("/admin/matches");
}

// Records the final score and per-player stats, then marks the
// match completed. This is the single write that produces every
// number shown on player profiles — nothing else edits stats.
export async function recordResult(matchId: string, formData: FormData) {
  const supabase = await createClient();

  const home_score = Number(formData.get("home_score") ?? 0);
  const away_score = Number(formData.get("away_score") ?? 0);
  const motmPlayerId = String(formData.get("motm") ?? "");

  const { data: squad } = await supabase
    .from("match_squad")
    .select("player_id")
    .eq("match_id", matchId)
    .eq("selected", true);

  const rows = (squad ?? []).map((s) => ({
    match_id: matchId,
    player_id: s.player_id,
    goals: Number(formData.get(`goals_${s.player_id}`) ?? 0) || 0,
    assists: Number(formData.get(`assists_${s.player_id}`) ?? 0) || 0,
    clean_sheet: formData.get(`clean_sheet_${s.player_id}`) === "on",
    motm: motmPlayerId === s.player_id,
  }));

  if (rows.length > 0) {
    await supabase
      .from("match_stats")
      .upsert(rows, { onConflict: "match_id,player_id" });
  }

  await supabase
    .from("matches")
    .update({ home_score, away_score, status: "completed" })
    .eq("id", matchId);

  revalidatePath("/admin/matches");
  revalidatePath("/");
  revalidatePath("/results");
  revalidatePath(`/results/${matchId}`);
  redirect("/admin/matches");
}
