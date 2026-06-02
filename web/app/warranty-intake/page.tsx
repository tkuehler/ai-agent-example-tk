import type { Metadata } from 'next'
import Link from 'next/link'
import SmsDemo, { type SmsStep } from '@/components/SmsDemo'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Warranty Intake',
  description:
    'Randi captures symptom, serial, and photo via text, validates coverage, and hands your team a clean pre-filled claim. Faster cycle times. Fewer bad claims.',
}

const WARRANTY_SCRIPT: SmsStep[] = [
  {
    from: 'user',
    text: 'My X738 loader started smoking from the left hydraulic cylinder this morning',
    pauseAfter: 350,
  },
  {
    from: 'randi',
    text: 'I can start a warranty intake for that. What\'s the serial number on the unit? (Usually on the frame near the cab door)',
    typingDuration: 1700,
    pauseAfter: 700,
  },
  {
    from: 'user',
    text: '1LV0738ENKA046291',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'Got it — 2019 X738, 1,847 hours. You\'re still under the extended hydraulic coverage. Can you send a photo of the cylinder and the area around the leak?',
    typingDuration: 1900,
    pauseAfter: 700,
  },
  {
    from: 'user',
    text: 'Photo attached',
    isPhoto: true,
    pauseAfter: 400,
  },
  {
    from: 'randi',
    text: 'Thanks. Checking coverage...\n\nThis looks like a failed rod seal on the left lift cylinder — that\'s covered under your hydraulic components extension through 2,500 hours.\n\nI\'ve pre-filled claim #WC-4492:\n• Unit: X738 / 1LV0738ENKA046291\n• Failure: Left hydraulic cylinder rod seal\n• Hours at failure: 1,847\n• Photo: attached\n\nRouting to Sarah at your service desk now.',
    typingDuration: 2400,
    pauseAfter: 800,
  },
  {
    from: 'randi',
    text: 'Sarah just got notified with the full claim. She\'ll have an answer within 2 hours — no back-and-forth needed on her end.',
    typingDuration: 1400,
  },
]

const PROBLEMS = [
  {
    n: '01',
    title: '20-minute calls for 2-minute information',
    body: 'Serial number. Model year. Symptom. Hours. Photo. Every intake call is an agent collecting data that should have been captured up front, the first time.',
  },
  {
    n: '02',
    title: 'Photo ping-pong',
    body: 'Customer emails a blurry picture. You ask for a better angle. They call back. You ask again. The claim is a week old before you have what you need.',
  },
  {
    n: '03',
    title: 'Eligibility errors caught at billing, not intake',
    body: 'Out-of-coverage unit gets processed through the full claim workflow before anyone checks the hours or the coverage period. Time and money, wasted.',
  },
]

const STEPS = [
  {
    n: 1,
    title: 'Customer texts the failure description',
    body: 'They describe the problem in plain language. Randi handles the structured intake from there.',
  },
  {
    n: 2,
    title: 'Randi captures serial number and photo via MMS',
    body: 'Asks exactly what\'s needed, once. Photo request is frictionless — customer just replies with a picture.',
  },
  {
    n: 3,
    title: 'Coverage validated against your rules',
    body: 'Hours, coverage period, component eligibility — checked automatically against your warranty policy. No surprises at billing.',
  },
  {
    n: 4,
    title: 'Claim pre-filled and routed',
    body: 'A complete, structured claim goes to your designated handler with all attachments. No missing fields. No follow-up calls.',
  },
  {
    n: 5,
    title: 'Human touches it when it\'s ready to approve',
    body: 'Not when it needs more information. Only when it\'s complete. That\'s the difference.',
  },
]

const IMPACTS = [
  {
    stat: '−70%',
    label: 'Intake time per claim',
    note: 'When first-contact capture is complete',
  },
  {
    stat: '−40%',
    label: 'Claims rejected for missing info',
    note: 'Structured intake eliminates the gaps',
  },
  {
    stat: '0',
    label: 'Triage calls for your staff',
    note: 'Humans touch complete claims only',
  },
]

export default function WarrantyIntakePage() {
  return (
    <main className="pt-16">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-navy pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-6">WARRANTY INTAKE</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream leading-none mb-8">
            EVERY WARRANTY CLAIM STARTS WITH MISSING INFO. YOURS DON&apos;T HAVE TO.
          </h1>
          <p className="font-editorial italic text-cream/65 text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
            Randi captures symptom, serial, and photo over text, checks coverage against your rules,
            and hands your team a clean pre-filled claim. The back-and-forth stops here.
          </p>
          <Link
            href="#contact"
            className="inline-block bg-gold text-navy font-sans font-bold text-base px-8 py-4 hover:bg-amber-400 transition-colors"
          >
            Set Up a Demo
          </Link>
        </div>
      </section>

      {/* ── The Mess Today ───────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">01 / THE PROBLEM</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            WARRANTY INTAKE IS THE MOST EXPENSIVE WORKFLOW YOU HAVEN&apos;T FIXED YET.
          </h2>
          <p className="font-editorial italic text-navy/55 text-xl mb-14">
            The information you need is simple. Getting it shouldn&apos;t be this hard.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {PROBLEMS.map((p) => (
              <div key={p.n} className="border-t-2 border-coral pt-6">
                <span className="font-display text-coral text-2xl block mb-3">{p.n}</span>
                <h3 className="font-sans font-semibold text-navy text-[15px] mb-3">{p.title}</h3>
                <p className="font-sans text-navy/55 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">02 / HOW IT WORKS</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-14 leading-tight">
            FROM FAILURE TEXT TO COMPLETE CLAIM, IN ONE THREAD.
          </h2>
          <ol className="space-y-0" aria-label="How warranty intake works">
            {STEPS.map((step, i) => (
              <li key={step.n} className="flex gap-6 pb-10 last:pb-0 relative">
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 bottom-0 w-px bg-navy-muted"
                    aria-hidden="true"
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center flex-shrink-0 z-10 bg-navy"
                  aria-hidden="true"
                >
                  <span className="font-display text-gold text-sm">{step.n}</span>
                </div>
                <div className="pt-1.5">
                  <h3 className="font-sans font-semibold text-cream mb-1.5">{step.title}</h3>
                  <p className="font-sans text-cream/50 text-sm leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── SMS Demo ─────────────────────────────────────────────────── */}
      <section className="bg-navy-light py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4 text-center">
            03 / SEE IT
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4 leading-tight text-center">
            INTAKE TO ROUTED CLAIM. ZERO PHONE TAG.
          </h2>
          <p className="font-editorial italic text-cream/45 text-lg mb-14 text-center">
            Watch the thread run, or tap Replay to run it again.
          </p>
          <SmsDemo script={WARRANTY_SCRIPT} />
        </div>
      </section>

      {/* ── Business Impact ──────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">04 / WHAT IT MEANS</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            LESS TIME ON TRIAGE. MORE CLAIMS THAT ACTUALLY STICK.
          </h2>
          <p className="font-sans text-navy/40 text-sm mb-14">
            Illustrative figures based on typical after-sales operations — not a guarantee.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {IMPACTS.map((item) => (
              <div key={item.stat} className="bg-navy p-8">
                <div className="font-display text-5xl text-gold mb-2 leading-none">{item.stat}</div>
                <div className="font-sans font-semibold text-cream text-[15px] mb-2">
                  {item.label}
                </div>
                <div className="font-sans text-cream/35 text-sm leading-relaxed">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rules Note ───────────────────────────────────────────────── */}
      <section className="bg-cream border-t border-navy/10 py-14 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-6">
          <div className="w-1 h-14 bg-gold flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <p className="font-display text-sm text-gold tracking-widest mb-3">
              NOTHING APPROVED AUTOMATICALLY.
            </p>
            <p className="font-sans text-navy text-[15px] leading-relaxed max-w-2xl">
              Randi follows your warranty and coverage rules to the letter. It validates eligibility,
              captures evidence, and pre-fills the claim. It does not approve anything. Every claim
              goes to a named human with full context — prepared, validated, and ready for a
              decision. Your rules, your call.
            </p>
          </div>
        </div>
      </section>

      <CTABlock
        headline="READY TO KILL THE WARRANTY BACK-AND-FORTH?"
        subhead="Complete claims. Clean handoffs. Less triage. Same staff — just not on the phone all day."
        buttonLabel="Set Up a Demo"
        buttonHref="mailto:hello@hey-randi.com"
      />
    </main>
  )
}
