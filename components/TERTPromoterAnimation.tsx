"use client"

import { useEffect, useState } from "react"

type Phase = "ref" | "alt"

type MutationBlock = {
  label: string
  refSeq: string[]
  altSeq: string[]
}

const BLOCKS: MutationBlock[] = [
  {
    label: "C228T (chr5:1,295,228)",
    refSeq: ["G", "G", "G", "C", "C", "C", "G", "G", "A", "A", "T", "C", "C", "C", "C", "C"],
    altSeq: ["G", "G", "G", "T", "T", "T", "C", "C", "G", "G", "A", "A", "T", "C", "C", "C", "C"],
  },
  {
    label: "C250T (chr5:1,295,250)",
    refSeq: ["G", "G", "G", "C", "C", "C", "G", "G", "A", "T", "C", "C", "C", "C", "G", "G"],
    altSeq: ["G", "G", "G", "T", "T", "T", "C", "C", "G", "G", "A", "T", "C", "C", "C", "C", "G", "G"],
  },
]

const MOTIF_START = 3
const MOTIF_END = 9

function nucleotideClass(base: string): string {
  if (base === "A") return "text-green-600"
  if (base === "T") return "text-orange-500"
  if (base === "C") return "text-blue-600"
  return "text-amber-600"
}

function SequenceLetters({ sequence }: { sequence: string[] }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-0.5">
      {sequence.map((base, idx) => (
        <span key={`${base}-${idx}`} className={`font-semibold ${nucleotideClass(base)}`}>
          {base}
        </span>
      ))}
    </span>
  )
}

function AltSequenceWithMotif({
  sequence,
  glow,
}: {
  sequence: string[]
  glow: boolean
}) {
  const prefix = sequence.slice(0, MOTIF_START)
  const motif = sequence.slice(MOTIF_START, MOTIF_END)
  const suffix = sequence.slice(MOTIF_END)

  return (
    <div className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
      <SequenceLetters sequence={prefix} />
      <span
        className={`inline-flex items-center gap-x-1 rounded-md border border-purple-600 px-1.5 py-0.5 ${glow ? "tert-motif-glow" : ""}`}
      >
        <SequenceLetters sequence={motif} />
      </span>
      <SequenceLetters sequence={suffix} />
    </div>
  )
}

export default function TERTPromoterAnimation() {
  const [phase, setPhase] = useState<Phase>("ref")
  const [runId, setRunId] = useState(0)
  const showAlt = phase === "alt"

  useEffect(() => {
    setPhase("ref")
    const switchTimer = window.setTimeout(() => {
      setPhase("alt")
    }, 1500)

    return () => {
      window.clearTimeout(switchTimer)
    }
  }, [runId])

  return (
    <div className="not-prose my-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <style>{`
        @keyframes tertMotifPulse {
          0% { box-shadow: 0 0 0px rgba(147, 51, 234, 0); }
          50% { box-shadow: 0 0 18px rgba(147, 51, 234, 0.85); }
          100% { box-shadow: 0 0 0px rgba(147, 51, 234, 0); }
        }
        .tert-motif-glow {
          animation: tertMotifPulse 2s ease-in-out infinite;
        }
      `}</style>

      <h3 className="mb-6 text-center text-base font-bold text-zinc-900 md:text-lg">
        De novo GABPA/ETS binding site created by TERT promoter mutations
      </h3>

      <div className="space-y-7">
        {BLOCKS.map((block) => (
          <section key={block.label} className="space-y-2">
            <p className="text-sm font-semibold text-zinc-800">{block.label}</p>

            <div className="font-mono text-sm leading-7 md:text-base">
              <div className="text-zinc-700">REF:</div>
              <div className="relative min-h-7">
                <div
                  className={`absolute inset-0 transition-opacity duration-400 ${showAlt ? "opacity-0" : "opacity-100"}`}
                  aria-hidden={showAlt}
                >
                  <SequenceLetters sequence={block.refSeq} />
                </div>
              </div>
            </div>

            <div className="font-mono text-sm leading-7 md:text-base">
              <div className="text-zinc-700">ALT:</div>
              <div className="relative min-h-7">
                <div
                  className={`absolute inset-0 transition-opacity duration-400 ${showAlt ? "opacity-100" : "opacity-0"}`}
                  aria-hidden={!showAlt}
                >
                  <AltSequenceWithMotif sequence={block.altSeq} glow={showAlt} />
                </div>
              </div>
              <p className={`mt-1 text-xs italic text-purple-700 transition-opacity duration-400 ${showAlt ? "opacity-100" : "opacity-0"}`}>
                GABPA/ETS motif (TTCCGG)
              </p>
            </div>
          </section>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          aria-label="Replay animation"
          onClick={() => setRunId((prev) => prev + 1)}
          className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-600 transition hover:bg-zinc-50"
        >
          ↺ Replay animation
        </button>
      </div>
    </div>
  )
}
