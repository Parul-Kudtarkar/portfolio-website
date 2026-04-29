"use client"

import { useEffect, useRef, useState } from "react"

type RowStatus = "met" | "partial" | "not_met"

type ChecklistRow = {
  status: RowStatus
  label: string
  detail: string
}

const rows: ChecklistRow[] = [
  { status: "met", label: "Non-coding variant", detail: "Promoter SNV - no protein change" },
  { status: "met", label: "Effect is cis (local)", detail: "GABPA binding at the variant site itself" },
  { status: "met", label: "Within 1 Mb window", detail: "TERT gene: chr5:1,253,147-1,295,068" },
  { status: "met", label: "De novo TF binding site", detail: "TTCCGG ETS motif created by C->T" },
  { status: "met", label: "TF has training data in model", detail: "GABPA: 539 TF ChIP tracks in HepG2" },
  { status: "met", label: "Chromatin effect expected", detail: "ATAC/DNase gain; H3K27ac, H3K4me3" },
  { status: "met", label: "Gene expression effect", detail: "TERT RNA-seq + CAGE gain expected" },
  { status: "partial", label: "Contact map effect possible", detail: "Promoter-enhancer loop change; weaker prior" },
  { status: "met", label: "Ground truth known", detail: "GABPA ChIP-seq validation (Li et al. 2015)" },
  { status: "met", label: "Benign controls available", detail: "Two high-AF gnomAD controls selected" },
]

const statusColor: Record<RowStatus, string> = {
  met: "#16a34a",
  partial: "#ea580c",
  not_met: "#dc2626",
}

const statusLabel: Record<RowStatus, string> = {
  met: "Criterion met",
  partial: "Partial",
  not_met: "Not met",
}

function statusSymbol(status: RowStatus): string {
  if (status === "partial") return "~"
  if (status === "not_met") return "!"
  return "✓"
}

export default function SuitabilityChecklist() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    let started = false
    const timeouts: number[] = []

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting || started) return

        started = true
        rows.forEach((_, idx) => {
          const t = window.setTimeout(() => {
            setVisibleCount((prev) => Math.max(prev, idx + 1))
          }, idx * 120)
          timeouts.push(t)
        })
        observer.disconnect()
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      timeouts.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="not-prose my-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <style>{`
        @keyframes checklistPillPop {
          0% { transform: scale(0.4); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>

      <h3 className="mb-5 text-center text-base font-bold text-zinc-900 md:text-lg">
        AlphaGenome suitability: TERT C228T/C250T
      </h3>

      <div className="w-full">
        {rows.map((row, idx) => {
          const isVisible = idx < visibleCount
          return (
            <div
              key={`${row.label}-${idx}`}
              className="flex w-full items-start gap-3 border-b border-zinc-100 py-3 last:border-b-0"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0px)" : "translateY(16px)",
                transition: "opacity 350ms ease-out, transform 350ms ease-out",
              }}
            >
              <span
                className="mt-0.5 inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{
                  backgroundColor: statusColor[row.status],
                  animation: isVisible ? "checklistPillPop 350ms ease-out both" : "none",
                }}
              >
                {statusSymbol(row.status)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900 md:text-[15px]">{row.label}</p>
                <p className="text-xs italic text-zinc-500 md:text-sm">{row.detail}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex w-full justify-end gap-4 text-xs md:text-sm">
        {(["met", "partial", "not_met"] as RowStatus[]).map((status) => (
          <div key={status} className="inline-flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-[2px]"
              style={{ backgroundColor: statusColor[status] }}
            />
            <span className="text-zinc-700">{statusLabel[status]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
