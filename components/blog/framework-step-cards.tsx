const STEPS = [
  {
    num: 1,
    name: "Audit your task mix this week.",
    body: "List every recurring task you do. Estimate the hours. Assign each to one of three buckets: Automate, Augment or Human-led. If you're honest, most people find 25–40% of their week in the Automate bucket.",
    accent: "#4A90D9",
  },
  {
    num: 2,
    name: "Find your highest-risk tasks.",
    body: "For each Automate-bucket task: what AI tool could handle this right now? Lit review → Elicit or Perplexity. Report generation → Claude with your data. Standard analysis → automated scripts. The tools exist. The question is adoption speed.",
    accent: "#EC4899",
  },
  {
    num: 3,
    name: "Identify your irreplaceable layer.",
    body: 'For each Human-led task: what makes this genuinely hard for AI? If the answer is "I have relationships," "I have domain judgment," or "someone is accountable", that\'s your moat. Write it down. Invest in it deliberately.',
    accent: "#8B5CF6",
  },
  {
    num: 4,
    name: "Build an augmentation habit, not a tool collection.",
    body: "Pick one Augment-zone task and build a reliable AI workflow for it this month. Not to replace your judgment, to compress the time between task start and your judgment being applied. That's the productivity model that survives every wave of AI advancement.",
    accent: "#F97316",
  },
]

export function FrameworkStepCards() {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className="border border-[#e5e5e5] bg-white"
          style={{
            borderRadius: "16px",
            padding: "20px 24px",
            borderTop: `3px solid ${step.accent}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="mb-3 flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-medium text-white"
            style={{ backgroundColor: step.accent }}
          >
            {step.num}
          </div>
          <p className="mb-2 text-[16px] font-medium text-[#1d1d1f]" role="heading" aria-level={4}>
            {step.name}
          </p>
          <p
            className="m-0 text-[14px] leading-[1.65] text-[#3d3d3f]"
          >
            {step.body}
          </p>
        </div>
      ))}
    </div>
  )
}
