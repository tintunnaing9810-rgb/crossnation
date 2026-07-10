import { NewMatchForm } from "@/components/NewMatchForm";
import { SectionHeading } from "@/components/ui";

export default function NewMatchPage() {
  return (
    <div className="max-w-lg space-y-8">
      <SectionHeading eyebrow="Fixtures" title="Announce a Match" />
      <NewMatchForm />
    </div>
  );
}
