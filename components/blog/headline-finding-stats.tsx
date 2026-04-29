/** Stat cards for “Headline findings”, static UI (no Chart.js). */
export function HeadlineFindingStats() {
  const cards = [
    {
      value: "176",
      label: "jobs analyzed",
      bg: "#EEF3FB",
      valueColor: "#4A90D9",
    },
    {
      value: "10.5%",
      label: "avg automate rate",
      bg: "#FEF0F7",
      valueColor: "#EC4899",
    },
    {
      value: "13.7 hrs",
      label: "avg saved/week",
      bg: "#FFF4ED",
      valueColor: "#F97316",
    },
  ] as const

  return (
    <div
      className="not-prose my-6 flex flex-row flex-wrap"
      style={{ gap: "12px" }}
    >
      {cards.map((c) => (
        <div
          key={c.label}
          className="min-w-[140px] flex-1 rounded-xl bg-white shadow-md ring-1 ring-[#E5E7EB]"
          style={{ padding: "16px" }}
        >
          <div className="rounded-lg p-3" style={{ backgroundColor: c.bg }}>
            <div
              className="text-[17px] font-medium tabular-nums tracking-tight"
              style={{ color: c.valueColor }}
            >
              {c.value}
            </div>
            <div
              className="mt-1 text-sm font-medium"
              style={{ color: "#6B7280" }}
            >
              {c.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
