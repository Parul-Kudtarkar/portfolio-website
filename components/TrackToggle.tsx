"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface TrackToggleProps {
  referenceImage: string
  mutantImage: string
}

type ViewMode = "reference" | "mutant"

const CAPTIONS: Record<ViewMode, string> = {
  reference: "Wild-type sequence, no GABPA binding",
  mutant: "Mutant sequence, de novo GABPA binding site created",
}

export default function TrackToggle({ referenceImage, mutantImage }: TrackToggleProps) {
  const [mode, setMode] = useState<ViewMode>("reference")

  const imageSrc = mode === "reference" ? referenceImage : mutantImage

  return (
    <div className="my-8 w-full">
      <div className="mx-auto mb-4 inline-flex rounded-full border border-border bg-background p-1">
        <button
          type="button"
          onClick={() => setMode("reference")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "reference"
              ? "bg-foreground text-background"
              : "border border-border bg-transparent text-foreground"
          }`}
          aria-pressed={mode === "reference"}
        >
          Reference
        </button>
        <button
          type="button"
          onClick={() => setMode("mutant")}
          className={`ml-1 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "mutant"
              ? "bg-foreground text-background"
              : "border border-border bg-transparent text-foreground"
          }`}
          aria-pressed={mode === "mutant"}
        >
          Mutant
        </button>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20">
        <AnimatePresence mode="wait">
          <motion.img
            key={mode}
            src={imageSrc}
            alt={mode === "reference" ? "Reference genomic track" : "Mutant genomic track"}
            className="h-auto w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      <div className="mt-2 min-h-6 text-sm text-muted-foreground">
        <AnimatePresence mode="wait">
          <motion.p
            key={`${mode}-caption`}
            className="m-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {CAPTIONS[mode]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
