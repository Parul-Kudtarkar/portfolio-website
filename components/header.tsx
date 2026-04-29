"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinkClass = (path: string) =>
    pathname === path ? "typography-nav-link-active" : "typography-nav-link hover:opacity-70"

  return (
    <header className="glass-header smooth-transition">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex h-full items-center ps-3 sm:ps-4 smooth-transition hover:opacity-80 shrink-0"
            aria-label="Parul Kudtarkar home"
          >
            <Image
              src="/logo.png"
              alt=""
              width={240}
              height={48}
              className="block h-12 w-auto max-h-12 object-contain object-left mix-blend-multiply"
              priority
            />
          </Link>

          <div className="flex h-full items-center gap-2 sm:gap-3">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex h-full items-center space-x-8">
              <Link href="/" className={`transition-colors ${navLinkClass("/")}`}>
                Home
              </Link>
              <Link href="/publications" className={`transition-colors ${navLinkClass("/publications")}`}>
                Publications
              </Link>
              <Link href="/art" className={`transition-colors ${navLinkClass("/art")}`}>
                Art
              </Link>
              <Link href="/blog" className={`transition-colors ${navLinkClass("/blog")}`}>
                Blog
              </Link>
            </nav>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className={`block px-4 py-2 rounded transition-colors ${navLinkClass("/")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/publications"
              className={`block px-4 py-2 rounded transition-colors ${navLinkClass("/publications")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Publications
            </Link>
            <Link
              href="/art"
              className={`block px-4 py-2 rounded transition-colors ${navLinkClass("/art")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Art
            </Link>
            <Link
              href="/blog"
              className={`block px-4 py-2 rounded transition-colors ${navLinkClass("/blog")}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
