import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-navy-muted">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-2xl text-cream tracking-widest mb-3">RANDI</div>
            <p className="font-sans text-cream/40 text-sm leading-relaxed max-w-xs">
              White-label SMS AI for equipment OEMs and dealers. No app. No portal. Just a text.
            </p>
          </div>
          <div>
            <p className="font-display text-xs text-gold tracking-widest mb-5">CAPABILITIES</p>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/parts-ordering"
                  className="font-sans text-cream/50 text-sm hover:text-cream transition-colors"
                >
                  Parts Ordering
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty-intake"
                  className="font-sans text-cream/50 text-sm hover:text-cream transition-colors"
                >
                  Warranty Intake
                </Link>
              </li>
              <li>
                <Link
                  href="/training"
                  className="font-sans text-cream/50 text-sm hover:text-cream transition-colors"
                >
                  Training
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-display text-xs text-gold tracking-widest mb-5">CONTACT</p>
            <a
              href="mailto:hello@hey-randi.com"
              className="font-sans text-cream/50 text-sm hover:text-cream transition-colors"
            >
              hello@hey-randi.com
            </a>
          </div>
        </div>
        <div className="border-t border-navy-muted mt-10 pt-8 text-cream/20 font-sans text-xs">
          © {new Date().getFullYear()} Randi. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
