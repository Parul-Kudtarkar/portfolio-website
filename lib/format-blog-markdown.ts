import { highlightCode } from "@/lib/shiki"
// NOTE: We intentionally do not use react-dom/server here.
// Turbopack disallows importing react-dom/server from non-React modules like this formatter.

// Allow only safe URL schemes to prevent XSS
export function isSafeHref(url: string): boolean {
  const t = url.trim().toLowerCase()
  return (
    t.startsWith("https://") ||
    t.startsWith("http://") ||
    t.startsWith("mailto:") ||
    t.startsWith("/") ||
    t.startsWith("#")
  )
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/** Markdown-like formatting with Shiki syntax highlighting for code blocks */
export async function formatBlogMarkdown(content: string): Promise<string> {
  // Support inline React-style citation tags inside blog markdown content.
  // Example: <Citation numbers={[1]} />
  content = content.replace(
    /<Citation\s+numbers=\{\[([^\]]+)\]\}\s*\/>/g,
    (_match, nums: string) => {
      const numbers = nums
        .split(",")
        .map((s) => Number.parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n))

      return numbers
        .map((n, i) => {
          const href = `#ref-${n}`
          const id = `cite-${n}`
          // Keep markup aligned with components/Citation.tsx
          return `<sup><a href="${href}" id="${id}" class="text-blue-600 hover:underline no-underline mx-0.5">[${n}]</a>${i < numbers.length - 1 ? "" : ""}</sup>`
        })
        .join("")
    }
  )

  function processInlineMarkdown(text: string): string {
    let processed = text
    const imageTokens: string[] = []

    processed = processed.replace(/\\\*/g, "*")
    processed = processed.replace(/\\\[/g, "[")
    processed = processed.replace(/\\\]/g, "]")
    processed = processed.replace(/\\\(/g, "(")
    processed = processed.replace(/\\\)/g, ")")
    processed = processed.replace(/\\`/g, "`")

    // Protect image markdown first so later emphasis parsing
    // does not corrupt file names containing underscores.
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_match, alt: string, href: string) => {
        const safeHref = isSafeHref(href) ? href : "#"
        const safeAlt = escapeHtml(alt)
        const token = `@@IMGTOKEN${imageTokens.length}@@`
        imageTokens.push(
          `<img src="${escapeHtml(safeHref)}" alt="${safeAlt}" class="w-full max-w-2xl rounded-lg border border-border shadow-sm my-6 mx-auto block" loading="lazy" />`
        )
        return token
      }
    )

    processed = processed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    processed = processed.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>")
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, linkText: string, href: string) => {
        const safeHref = isSafeHref(href) ? href : "#"
        const safeText = escapeHtml(linkText)
        return `<a href="${escapeHtml(safeHref)}" class="text-primary hover:underline" rel="noopener noreferrer">${safeText}</a>`
      }
    )
    processed = processed.replace(
      /`([^`]+)`/g,
      (_, code: string) =>
        `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${escapeHtml(code)}</code>`
    )

    processed = processed.replace(/@@IMGTOKEN(\d+)@@/g, (_m, idx: string) => {
      return imageTokens[Number(idx)] ?? _m
    })

    return processed
  }

  function splitTableRow(row: string): string[] {
    const trimmed = row.trim()
    const parts = trimmed.split("|")
    return parts.slice(1, -1).map((c) => c.trim())
  }

  const lines = content.split("\n")
  const result: string[] = []
  let inCodeBlock = false
  let codeBlockLanguage = ""
  let codeBlockContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        const code = codeBlockContent.join("\n")
        const highlighted = await highlightCode(code, codeBlockLanguage || "text")
        result.push(highlighted)
        codeBlockContent = []
        inCodeBlock = false
        codeBlockLanguage = ""
      } else {
        inCodeBlock = true
        codeBlockLanguage = line.substring(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    if (line.startsWith("# ")) {
      const headerText = processInlineMarkdown(line.substring(2))
      result.push(`<h1>${headerText}</h1>`)
      continue
    }
    if (line.startsWith("## ")) {
      const headerText = processInlineMarkdown(line.substring(3))
      result.push(`<h2>${headerText}</h2>`)
      continue
    }
    if (line.startsWith("### ")) {
      const headerText = processInlineMarkdown(line.substring(4))
      result.push(`<h3>${headerText}</h3>`)
      continue
    }
    if (line.startsWith("#### ")) {
      const headerText = processInlineMarkdown(line.substring(5))
      result.push(`<h4>${headerText}</h4>`)
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      result.push(`<hr class="my-8 border-border" />`)
      continue
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const listText = processInlineMarkdown(trimmed.substring(2))
      result.push(`<li class="mb-1">${listText}</li>`)
      continue
    }

    if (trimmed.startsWith(">")) {
      const quoteText = trimmed.replace(/^>\s?/, "")
      const processedQuote = processInlineMarkdown(quoteText)
      result.push(`<blockquote>${processedQuote}</blockquote>`)
      continue
    }

    if (
      trimmed.startsWith("<iframe") ||
      trimmed.startsWith("<figure") ||
      trimmed.startsWith("<figcaption") ||
      trimmed.startsWith("<img")
      || trimmed.startsWith("</figcaption") ||
      trimmed.startsWith("</figure")
    ) {
      result.push(trimmed)
      continue
    }

    if (/^!\[[^\]]*\]\([^)]+\)$/.test(trimmed)) {
      result.push(processInlineMarkdown(trimmed))
      continue
    }

    const nextTrimmed = lines[i + 1]?.trim()
    if (
      trimmed.startsWith("|") &&
      nextTrimmed &&
      nextTrimmed.startsWith("|") &&
      nextTrimmed.includes("---")
    ) {
      const headerCells = splitTableRow(trimmed)
      const rows: string[][] = []
      let j = i + 2
      while (j < lines.length) {
        const r = lines[j].trim()
        if (!r.startsWith("|")) break
        rows.push(splitTableRow(r))
        j++
      }

      const thead = `<thead><tr>${headerCells
        .map((h) => `<th>${processInlineMarkdown(h)}</th>`)
        .join("")}</tr></thead>`
      const tbody = `<tbody>${rows
        .map((row) => {
          const padded = [...row]
          while (padded.length < headerCells.length) padded.push("")
          return `<tr>${padded
            .map((c) => `<td>${processInlineMarkdown(c)}</td>`)
            .join("")}</tr>`
        })
        .join("")}</tbody>`

      result.push(
        `<div class="my-4 overflow-x-auto rounded-lg border border-border shadow-sm"><table class="w-full">${thead}${tbody}</table></div>`
      )

      i = j - 1
      continue
    }

    if (trimmed === "") {
      continue
    }

    const processedLine = processInlineMarkdown(line)
    result.push(`<p class="mb-2 leading-7">${processedLine}</p>`)
  }

  let finalResult: string[] = []
  let inList = false

  for (let i = 0; i < result.length; i++) {
    if (result[i].startsWith("<li")) {
      if (!inList) {
        finalResult.push('<ul class="mb-3 ml-6 list-disc">')
        inList = true
      }
      finalResult.push(result[i])
    } else {
      if (inList) {
        finalResult.push("</ul>")
        inList = false
      }
      finalResult.push(result[i])
    }
  }

  if (inList) {
    finalResult.push("</ul>")
  }

  return finalResult.join("\n")
}
