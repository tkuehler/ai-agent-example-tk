'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { label: 'Parts Ordering', href: '/parts-ordering' },
  { label: 'Warranty Intake', href: '/warranty-intake' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-muted">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl text-cream tracking-widest hover:text-gold transition-colors"
        >
          RANDI
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-sans text-sm transition-colors ${
                path === href ? 'text-cream' : 'text-cream/60 hover:text-cream'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="font-sans text-sm font-semibold bg-gold text-navy px-4 py-2 hover:bg-amber-400 transition-colors"
          >
            Get a Demo
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          className="md:hidden bg-navy border-t border-navy-muted px-6 py-5 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-sans text-cream/70 hover:text-cream transition-colors py-1"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="font-sans text-sm font-semibold bg-gold text-navy px-4 py-3 text-center mt-2"
            onClick={() => setOpen(false)}
          >
            Get a Demo
          </Link>
        </nav>
      )}
    </header>
  )
}
