"use client"

import { useEffect, useRef, useState } from "react"

const models = ["Enformer", "Borzoi", "AlphaGenome"]

const rows = [
  { criterion: "Input window", values: ["196 kb", "524 kb", "1,048 kb"], highlight: [false, false, true] },
  { criterion: "RNA resolution", values: ["128 bp", "128 bp", "1 bp"], highlight: [false, false, true] },
  { criterion: "ATAC/DNase resolution", values: ["128 bp", "128 bp", "1 bp"], highlight: [false, false, true] },
  { criterion: "ChIP resolution", values: ["128 bp", "128 bp", "128 bp"], highlight: [false, false, false] },
  { criterion: "Contact maps", values: ["No", "No", "Yes"], highlight: [false, false, true] },
  { criterion: "Built-in variant API", values: ["No", "No", "Yes"], highlight: [false, false, true] },
  { criterion: "GeneScorer", values: ["No", "No", "Yes"], highlight: [false, false, true] },
  { criterion: "Max cell line tracks", values: ["~200", "~200", "565 (HepG2)"], highlight: [false, false, true] },
  { criterion: "Training data", values: ["ENCODE 3", "ENCODE 4", "ENCODE 4+"], highlight: [false, false, true] },
  { criterion: "Year", values: ["2021", "2023", "2026"], highlight: [false, false, true] },
]

export default function ModelComparisonTable() {
  const ref = useRef<HTMLDivElement>(null)
  const [visibleRows, setVisibleRows] = useState<boolean[]>(
    new Array(rows.length).fill(false)
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          rows.forEach((_, i) => {
            setTimeout(() => {
              setVisibleRows((prev) => {
                const next = [...prev]
                next[i] = true
                return next
              })
            }, i * 80)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="not-prose my-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <style>{`
        @keyframes cellGlow {
          0% { box-shadow: 0 0 0px rgba(37,99,235,0); }
          40% { box-shadow: 0 0 14px rgba(37,99,235,0.6); }
          100% { box-shadow: 0 0 0px rgba(37,99,235,0); }
        }
        .ag-cell-glow {
          animation: cellGlow 800ms ease-out forwards;
        }
      `}</style>

      <h3 className="mb-5 text-center text-base font-bold text-zinc-900 md:text-lg">
        Sequence-to-function model comparison
      </h3>

      <div ref={ref} className="overflow-x-auto">
        <table className="w-full min-w-[740px] border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-sm font-semibold text-zinc-700">Criterion</th>
              {models.map((model) => (
                <th key={model} className="px-3 py-2 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${
                      model === "AlphaGenome" ? "bg-blue-600 text-white" : "bg-zinc-700 text-white"
                    }`}
                  >
                    {model}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.criterion}
                style={{
                  opacity: visibleRows[i] ? 1 : 0,
                  transform: visibleRows[i] ? "translateY(0)" : "translateY(10px)",
                  transition: "opacity 300ms ease-out, transform 300ms ease-out",
                }}
              >
                <td className="rounded-l-md bg-slate-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                  {row.criterion}
                </td>
                {row.values.map((value, colIdx) => {
                  const highlighted = row.highlight[colIdx]
                  return (
                    <td
                      key={`${row.criterion}-${models[colIdx]}`}
                      className={`px-3 py-2 text-center text-sm ${
                        colIdx === row.values.length - 1 ? "rounded-r-md" : ""
                      } ${
                        highlighted ? "bg-blue-500 font-bold text-white" : "bg-slate-50 text-zinc-700"
                      } ${highlighted && visibleRows[i] ? "ag-cell-glow" : ""}`}
                    >
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm italic text-blue-700">
        AlphaGenome selected for this analysis (highlighted)
      </p>
    </div>
  )
}
