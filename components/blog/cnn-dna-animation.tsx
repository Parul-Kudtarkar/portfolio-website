"use client"

import { cn } from "@/lib/utils"

/**
 * CNN sliding filter over DNA, colors: enhancer #E91E8C, promoter #F5A623,
 * TF #8B5CF6, DNA backbone #4A7FD4
 */
const C = {
  enhancer: "#E91E8C",
  promoter: "#F5A623",
  tf: "#8B5CF6",
  backbone: "#4A7FD4",
} as const

const BASES = ["A", "T", "G", "C", "T", "A", "T", "A", "G", "C", "G", "A"] as const

export type CnnDnaAnimationVariant = "article" | "card"

export function CnnDnaAnimation({
  variant = "article",
}: {
  variant?: CnnDnaAnimationVariant
}) {
  const isCard = variant === "card"
  const cell = 44
  const gap = 8
  const filterW = 4 * cell + 3 * gap
  const trackW = 12 * cell + 11 * gap

  return (
    <figure
      className={cn(
        "cnn-dna-root not-prose w-full overflow-x-auto",
        isCard ? "my-0" : "my-10"
      )}
      aria-label="Animation: a four-base CNN filter scans a twelve-base DNA sequence, pauses on TATA, and shows a high activation label"
    >
      <div className="mx-auto px-1" style={{ width: trackW, minWidth: trackW }}>
        <div
          className={cn(
            "mb-1 flex items-baseline justify-between gap-2",
            isCard && "mb-0.5"
          )}
        >
          <span
            className={cn(
              "font-medium text-foreground",
              isCard ? "text-xs" : "text-sm"
            )}
          >
            Raw DNA
          </span>
          {!isCard && (
            <span className="text-xs text-muted-foreground">
              … hundreds of filters in parallel
            </span>
          )}
        </div>

        <div className="relative" style={{ height: 128 }}>
          {/* Filter + callout move together */}
          <div
            className="cnn-dna-filter-g pointer-events-none absolute left-0 top-0 z-10"
            style={{ width: filterW }}
          >
            <div
              className="rounded-md border-2 border-dashed px-1 pb-0.5 pt-1"
              style={{
                borderColor: C.tf,
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
            >
              <span
                className="block text-center text-[10px] font-medium leading-tight sm:text-xs"
                style={{ color: C.tf }}
              >
                TATA filter (4 bp)
              </span>
            </div>

            <div
              className="cnn-dna-activation flex justify-center"
              style={{ marginTop: 56, width: "100%" }}
            >
              <div
                className="rounded-md px-2 py-1 text-center text-[11px] font-medium shadow-sm sm:text-xs"
                style={{
                  border: `2px solid ${C.promoter}`,
                  color: C.enhancer,
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                High activation, TATA motif detected
              </div>
            </div>
          </div>

          {/* DNA row (static) */}
          <div
            className="absolute left-0 flex gap-2"
            style={{ top: 44, width: trackW }}
          >
            {BASES.map((b, i) => {
              const inTataMotif = i >= 4 && i <= 7
              return (
                <div
                  key={i}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-base font-medium"
                  style={{
                    border: `2px solid ${C.backbone}`,
                    color: C.backbone,
                    backgroundColor: inTataMotif
                      ? "rgba(233, 30, 140, 0.12)"
                      : "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  {b}
                </div>
              )
            })}
          </div>
        </div>

        {!isCard && (
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            CNNs also downsample: 1 Mb of bases → compressed feature map (faster for the next layer).
            Each position can represent a window of sequence, not only a single base.
          </p>
        )}
      </div>
    </figure>
  )
}
