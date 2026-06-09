import Link from "next/link"
import { Linkedin, Github, ExternalLink } from "lucide-react"

export default function Footer() {
  return (
    <footer className="glass-footer">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-sm text-muted-foreground">© 2026 Parul Kudtarkar | All rights reserved</p>
            <Link
              href="https://sortingmydna.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1 mt-2"
            >
              sortingmydna.com
              <ExternalLink size={14} />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/parulkudtarkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/Parul-Kudtarkar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://scholar.google.com/citations?user=mJwZw2kAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors"
              aria-label="Google Scholar"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
