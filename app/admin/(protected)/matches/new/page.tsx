import { MatchForm } from "@/components/MatchForm";
import { createMatch } from "../actions";
import { SectionHeading } from "@/components/ui";

export default function NewMatchPage() {
  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading eyebrow="Fixtures" title="Announce a Match" />
      <MatchForm action={createMatch} submitLabel="Create match & set squad next" />
    </div>
  );
}
