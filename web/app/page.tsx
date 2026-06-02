import type { Metadata } from 'next'
import Link from 'next/link'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Randi — AI Service Assistant for Equipment OEMs',
  description:
    'White-label SMS AI for equipment OEMs and dealers. Randi identifies equipment, pulls OEM procedures, matches parts, and closes the sale — over text.',
}

const CAPABILITIES = [
  {
    href: '/parts-ordering',
    label: 'PARTS ORDERING',
    title: 'Turn every service call into a parts sale.',
    body: 'Randi serves the quote and takes the order in the same thread. No dropped quote. No callback. No lost sale.',
  },
  {
    href: '/warranty-intake',
    label: 'WARRANTY INTAKE',
    title: 'Clean claims in. Less triage out.',
    body: 'Randi captures symptom, serial, and photo over text, validates coverage, and hands your team a pre-filled claim.',
  },
]

export default function HomePage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-navy pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-6">
            WHITE-LABEL SMS AI FOR EQUIPMENT OEMs
          </p>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-cream leading-none mb-8">
            YOUR CUSTOMERS TEXT.
            <br />
            RANDI HANDLES IT.
          </h1>
          <p className="font-editorial italic text-cream/65 text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
            A tech texts a number. Randi identifies the equipment, pulls the exact procedure from
            your OEM manual, matches the part, and closes the sale — all over text. No app. No
            portal. No call center.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/parts-ordering"
              className="inline-block bg-gold text-navy font-sans font-bold text-base px-8 py-4 hover:bg-amber-400 transition-colors"
            >
              See Parts Ordering
            </Link>
            <Link
              href="/warranty-intake"
              className="inline-block border border-cream/40 text-cream font-sans font-bold text-base px-8 py-4 hover:border-cream/70 transition-colors"
            >
              See Warranty Intake
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities grid */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-10">CAPABILITIES</p>
          <div className="grid md:grid-cols-2 gap-6">
            {CAPABILITIES.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group bg-navy p-8 block hover:bg-navy-light transition-colors"
              >
                <p className="font-display text-[11px] text-gold tracking-widest mb-4">{f.label}</p>
                <h2 className="font-display text-2xl text-cream mb-3 leading-tight group-hover:text-gold transition-colors">
                  {f.title}
                </h2>
                <p className="font-sans text-cream/50 text-sm leading-relaxed mb-6">{f.body}</p>
                <span className="font-sans text-gold text-sm font-semibold">
                  See how it works →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABlock
        headline="SOUNDS ABOUT RIGHT FOR YOUR OPERATION?"
        subhead="One conversation. Every time. White-labeled to your brand."
        buttonLabel="Set Up a Demo"
        buttonHref="mailto:hello@hey-randi.com"
      />
    </main>
  )
}
