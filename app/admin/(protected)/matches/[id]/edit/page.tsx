import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateMatch } from "../../actions";
import { MatchForm } from "@/components/MatchForm";
import { SectionHeading } from "@/components/ui";
import { formatDateInput } from "@/lib/format";
import type { Match } from "@/lib/types";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const match = data as Match | null;
  if (!match) notFound();

  const updateWithId = updateMatch.bind(null, id);

  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading eyebrow="Fixtures" title="Edit Match" />
      <MatchForm
        action={updateWithId}
        submitLabel="Save changes"
        defaults={{
          match_type: match.match_type,
          opponent: match.opponent,
          match_date: formatDateInput(match.match_date),
          venue: match.venue ?? "",
          home_away: match.home_away,
        }}
      />
    </div>
  );
}
