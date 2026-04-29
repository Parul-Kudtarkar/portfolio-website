type Row = {
  role: string
  exposure: string
  risk: string
  moat: string
  verdict: string
}

const ROWS: Row[] = [
  {
    role: "Plumber / Electrician",
    exposure: "Near zero",
    risk: "Very low, physical dexterity, embodied judgment",
    moat: "Irreplaceable in physical world",
    verdict: "Very safe. Automate admin layer (quoting, scheduling, invoicing).",
  },
  {
    role: "Teacher / Educator",
    exposure: "Low-medium",
    risk: "Content delivery, lesson planning",
    moat: "Relationship, mentorship, motivation",
    verdict: "Adapt: use AI for prep, double down on human connection.",
  },
  {
    role: "Nurse / Clinician",
    exposure: "Low",
    risk: "Documentation, coding, admin",
    moat: "Patient judgment, empathy, hands-on care",
    verdict: "Safe. Automate paperwork layer aggressively.",
  },
  {
    role: "Accountant / Analyst",
    exposure: "Medium-high",
    risk: "Standard reporting, data entry, reconciliation",
    moat: "Strategic advisory, complex judgment",
    verdict: "Automate the bottom 40% of tasks now.",
  },
  {
    role: "Bioinformatician / Comp Bio",
    exposure: "Medium",
    risk: "Pipelines, lit review, QC, annotation",
    moat: "Biological judgment, clinical context, novel methods",
    verdict: "Augment strategically. Sector matters hugely.",
  },
  {
    role: "Software Engineer",
    exposure: "High",
    risk: "Code generation, testing, docs, debugging",
    moat: "Architecture, system design, cross-team judgment",
    verdict: "Highest pressure. Senior/principal moat is real and growing.",
  },
  {
    role: "Data Entry / Admin",
    exposure: "Very high",
    risk: "Most tasks already automatable",
    moat: "Human oversight, exception handling",
    verdict: "Transition urgently. Moat is thin and shrinking.",
  },
]

const EXPOSURE_STYLES: Record<string, { bg: string; color: string }> = {
  "Near zero": { bg: "#EEF3FB", color: "#4A90D9" },
  Low: { bg: "#EEF9F0", color: "#34c759" },
  "Low-medium": { bg: "#F3EFFE", color: "#8B5CF6" },
  Medium: { bg: "#FFF4ED", color: "#F97316" },
  "Medium-high": { bg: "#FEF3E8", color: "#ff9500" },
  High: { bg: "#FEF0F7", color: "#EC4899" },
  "Very high": { bg: "#FCEAEA", color: "#cc0000" },
}

function ExposurePill({ label }: { label: string }) {
  const s = EXPOSURE_STYLES[label] ?? { bg: "#f5f5f7", color: "#6e6e73" }
  return (
    <span
      className="inline-block font-medium whitespace-nowrap"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        borderRadius: "20px",
        padding: "3px 10px",
        fontSize: "12px",
      }}
    >
      {label}
    </span>
  )
}

export function OccupationRiskTable() {
  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-2xl border border-[#e5e5e5]"
      style={{ borderRadius: "16px" }}
    >
      <table
        className="w-full border-separate border-spacing-0 text-left"
        style={{ borderCollapse: "separate" }}
      >
        <thead>
          <tr className="bg-[#f5f5f7]">
            {(
              ["Role", "Observed exposure", "Primary risk", "Primary moat", "Net verdict"] as const
            ).map((h) => (
              <th
                key={h}
                className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#6e6e73]"
                style={{ padding: "12px 16px" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr
              key={row.role}
              className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}
              style={{
                borderBottom: i === ROWS.length - 1 ? undefined : "1px solid #f0f0f0",
                fontSize: "14px",
                verticalAlign: "top",
              }}
            >
              <td style={{ padding: "14px 16px", color: "#1d1d1f" }}>{row.role}</td>
              <td style={{ padding: "14px 16px" }}>
                <ExposurePill label={row.exposure} />
              </td>
              <td style={{ padding: "14px 16px", color: "#3d3d3f" }}>{row.risk}</td>
              <td style={{ padding: "14px 16px", color: "#3d3d3f" }}>{row.moat}</td>
              <td
                className="font-medium text-[#1d1d1f]"
                style={{ padding: "14px 16px", fontSize: "14px" }}
              >
                {row.verdict}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
