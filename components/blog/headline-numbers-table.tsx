/** Apple-style metric table for Anthropic “headline numbers”. */
export function HeadlineNumbersTable() {
  const rows = [
    {
      metric: "AI use leans toward augmentation",
      figure: "57% augmentation vs 43% automation",
    },
    {
      metric: "Jobs using AI in 25%+ of tasks",
      figure: "36% of all occupations",
    },
    {
      metric: "Jobs using AI in 75%+ of tasks",
      figure: "Only 4% of occupations",
    },
    {
      metric: "Life sciences share of Claude usage",
      figure: "6.4%, 5th largest category",
    },
  ]

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white"
      style={{ borderRadius: "16px" }}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[#f5f5f7]">
            <th
              className="px-5 py-3 text-[13px] font-medium uppercase tracking-[0.05em] text-[#6e6e73]"
              style={{ padding: "12px 20px" }}
            >
              Metric
            </th>
            <th
              className="px-5 py-3 text-[13px] font-medium uppercase tracking-[0.05em] text-[#6e6e73]"
              style={{ padding: "12px 20px" }}
            >
              Figure
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.metric}
              className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}
              style={{
                borderBottom: i === rows.length - 1 ? undefined : "1px solid #f0f0f0",
              }}
            >
              <td
                className="text-[15px] text-[#1d1d1f]"
                style={{ padding: "14px 20px" }}
              >
                {row.metric}
              </td>
              <td
                className="text-[15px] font-medium text-[#1d1d1f]"
                style={{ padding: "14px 20px" }}
              >
                {row.figure}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
