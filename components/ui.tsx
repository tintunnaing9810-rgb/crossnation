export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-lime mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wide">
        {title}
      </h2>
      <span className="tri-bar mt-3" />
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line rounded-lg px-6 py-10 text-center text-muted text-sm">
      {children}
    </div>
  );
}

export function StatPill({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-surface border border-line rounded-md px-4 py-3 text-center">
      <div className="font-display text-2xl font-semibold text-paper">
        {value}
      </div>
      <div className="text-[11px] uppercase tracking-wide text-muted mt-1">
        {label}
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "lime";
}) {
  const toneClasses =
    tone === "gold"
      ? "bg-gold/15 text-gold border-gold/30"
      : tone === "lime"
      ? "bg-lime/15 text-lime border-lime/30"
      : "bg-surface-2 text-muted border-line";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide ${toneClasses}`}
    >
      {children}
    </span>
  );
}
