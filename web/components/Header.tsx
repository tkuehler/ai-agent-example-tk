'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const CAPABILITIES = [
  { label: 'Parts Ordering', href: '/parts-ordering', desc: 'Quote to order, in one thread' },
  { label: 'Warranty Intake', href: '/warranty-intake', desc: 'Clean claims, faster cycle' },
  { label: 'Training', href: '/training', desc: 'Certs delivered over text' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const path = usePathname()
  const dropRef = useRef<HTMLDivElement>(null)

  const isCapabilityActive = CAPABILITIES.some((c) => c.href === path)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDropOpen(false)
    setMobileOpen(false)
  }, [path])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-muted">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl text-cream tracking-widest hover:text-gold transition-colors"
        >
          RANDI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {/* Capabilities dropdown */}
          <div ref={dropRef} className="relative">
            <button
              onClick={() => setDropOpen(!dropOpen)}
              aria-expanded={dropOpen}
              aria-haspopup="true"
              className={`font-sans text-sm flex items-center gap-1.5 transition-colors focus:outline-none ${
                isCapabilityActive ? 'text-cream' : 'text-cream/60 hover:text-cream'
              }`}
            >
              Capabilities
              <svg
                viewBox="0 0 24 24"
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropOpen && (
              <div
                className="absolute top-full right-0 mt-3 w-60 bg-navy-light border border-navy-muted shadow-2xl py-1"
                role="menu"
              >
                {CAPABILITIES.map(({ label, href, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={`block px-4 py-3 transition-colors hover:bg-navy-muted group ${
                      path === href ? 'bg-navy-muted' : ''
                    }`}
                  >
                    <span
                      className={`font-sans text-sm font-medium block ${
                        path === href ? 'text-gold' : 'text-cream group-hover:text-cream'
                      }`}
                    >
                      {label}
                    </span>
                    <span className="font-sans text-xs text-cream/35 mt-0.5 block">{desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

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
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
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
            {mobileOpen ? (
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
      {mobileOpen && (
        <nav
          className="md:hidden bg-navy border-t border-navy-muted px-6 py-5 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          <p className="font-display text-[11px] text-gold tracking-widest mb-2 mt-1">
            CAPABILITIES
          </p>
          {CAPABILITIES.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`font-sans text-sm py-2 pl-3 border-l-2 transition-colors ${
                path === href
                  ? 'text-cream border-gold'
                  : 'text-cream/60 border-transparent hover:text-cream hover:border-gold/40'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="#contact"
            className="font-sans text-sm font-semibold bg-gold text-navy px-4 py-3 text-center mt-4"
          >
            Get a Demo
          </Link>
        </nav>
      )}
    </header>
  )
}
