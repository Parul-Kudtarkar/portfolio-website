import React from "react"

export default function Citation({ numbers }: { numbers: number[] }) {
  return (
    <>
      {numbers.map((n, i) => (
        <sup key={n}>
          <a
            href={`#ref-${n}`}
            id={`cite-${n}`}
            className="text-blue-600 hover:underline no-underline mx-0.5"
          >
            [{n}]
          </a>
          {i < numbers.length - 1 ? "" : ""}
        </sup>
      ))}
    </>
  )
}

