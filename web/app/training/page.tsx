import type { Metadata } from 'next'
import Link from 'next/link'
import SmsDemo, { type SmsStep } from '@/components/SmsDemo'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Training',
  description:
    'Randi delivers OEM training and certifications over text. No LMS login. No scheduled class. Tech gets a message, answers questions, gets certified.',
}

const TRAINING_SCRIPT: SmsStep[] = [
  {
    from: 'randi',
    text: 'Hey Marcus — your 250-hr hydraulics cert is due in 7 days. Takes about 5 minutes over text. Want to knock it out now?',
    typingDuration: 1700,
    chips: ['Yes, let\'s go', 'Remind me tomorrow'],
    pauseAfter: 700,
  },
  {
    from: 'user',
    text: 'Yes, let\'s go',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: '4 questions. Q1 of 4: At what interval does the 3025E hydraulic filter need replacing?\n\nA) 100 hrs\nB) 250 hrs\nC) 500 hrs',
    typingDuration: 1600,
    chips: ['A', 'B', 'C'],
    pauseAfter: 700,
  },
  {
    from: 'user',
    text: 'B',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'Correct. Q2 of 4: What\'s the first visible sign of a failing pump seal on this unit?',
    typingDuration: 1300,
    pauseAfter: 600,
  },
  {
    from: 'user',
    text: 'External leak near the pump',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'Right — external seepage at the pump body, before you see any pressure loss. Q3 of 4: Hydraulic fluid is milky or foamy. What\'s the likely cause?',
    typingDuration: 1800,
    pauseAfter: 600,
  },
  {
    from: 'user',
    text: 'Water contamination',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'Exactly. Q4 of 4 (last one): What\'s the max safe operating temp for this hydraulic system?',
    typingDuration: 1400,
    chips: ['160°F', '180°F', '200°F'],
    pauseAfter: 600,
  },
  {
    from: 'user',
    text: '180°F',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: '4 for 4. Cert logged — good for 12 months. I\'ll text you when it\'s due again. Nice work.',
    typingDuration: 1500,
  },
]

const PROBLEMS = [
  {
    n: '01',
    title: 'The LMS nobody logs into',
    body: 'You bought a training platform. You set up the modules. You sent the link. Completion rate: 12%. The portal requires a login from a computer they don\'t sit at.',
  },
  {
    n: '02',
    title: 'The printed manual nobody reads twice',
    body: 'Binder in the break room. Last updated 2019. The new guy read it once during orientation. Nobody knows which page the hydraulic specs are on.',
  },
  {
    n: '03',
    title: 'The cert that lapsed because nobody tracked it',
    body: 'Tech was fully qualified three years ago. Nobody sent a reminder. Now you find out in the field — after a warranty dispute — that the cert expired eight months back.',
  },
]

const STEPS = [
  {
    n: 1,
    title: 'OEM defines modules and pass thresholds once',
    body: 'You write the questions, set the pass score, and schedule when certs expire. Randi runs it from there.',
  },
  {
    n: 2,
    title: 'Randi texts the tech when a cert is due or a module is pushed',
    body: 'Proactive, not reactive. The tech gets a text — not an email they ignore.',
  },
  {
    n: 3,
    title: 'Tech answers in the thread — no login, no app',
    body: 'Questions arrive as messages. Answers are texts. The whole module runs in the same conversation.',
  },
  {
    n: 4,
    title: 'Randi scores in real time and logs the result',
    body: 'Pass: cert logged instantly, confirmation sent. Fail: immediate feedback on which questions missed, re-prompt when they\'re ready.',
  },
  {
    n: 5,
    title: 'Expired certs trigger automatic re-prompt',
    body: 'No manual tracking. No chasing. Randi knows when each cert expires and texts before it lapses.',
  },
]

const IMPACTS = [
  {
    stat: '4×',
    label: 'Higher training completion rates',
    note: 'When the channel is text, not a portal',
  },
  {
    stat: '0',
    label: 'Lapsed certs from missed reminders',
    note: 'Automatic re-prompts before expiry',
  },
  {
    stat: '$0',
    label: 'LMS license cost per field tech',
    note: 'No per-seat software to maintain',
  },
]

export default function TrainingPage() {
  return (
    <main className="pt-16">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-navy pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-6">TRAINING</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream leading-none mb-8">
            YOUR TRAINING CONTENT DOESN&apos;T REACH THE FIELD BECAUSE NOBODY OPENS THE LMS.
          </h1>
          <p className="font-editorial italic text-cream/65 text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
            Randi delivers training and certifications over text. Tech gets a message, answers
            questions, gets certified — no login, no portal, no scheduled class.
          </p>
          <Link
            href="#contact"
            className="inline-block bg-gold text-navy font-sans font-bold text-base px-8 py-4 hover:bg-amber-400 transition-colors"
          >
            Set Up a Demo
          </Link>
        </div>
      </section>

      {/* ── The Problem ──────────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">01 / THE PROBLEM</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            FIELD TECHS DON&apos;T DO OPTIONAL TRAINING. THEY DO CONVENIENT TRAINING.
          </h2>
          <p className="font-editorial italic text-navy/55 text-xl mb-14">
            Make it inconvenient and it doesn&apos;t happen. The cert lapses. The knowledge gap stays.
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
            OEM WRITES IT ONCE. RANDI DELIVERS IT FOREVER.
          </h2>
          <ol className="space-y-0" aria-label="How training works">
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
            A FULL CERT MODULE. OVER TEXT. FIVE MINUTES.
          </h2>
          <p className="font-editorial italic text-cream/45 text-lg mb-14 text-center">
            Watch the thread run, or tap Replay to run it again.
          </p>
          <SmsDemo script={TRAINING_SCRIPT} />
        </div>
      </section>

      {/* ── Business Impact ──────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">04 / WHAT IT MEANS</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            TECHS ACTUALLY CERTIFIED. CERTS THAT DON&apos;T LAPSE.
          </h2>
          <p className="font-sans text-navy/40 text-sm mb-14">
            Illustrative figures based on typical field service operations — not a guarantee.
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

      {/* ── Content Note ─────────────────────────────────────────────── */}
      <section className="bg-cream border-t border-navy/10 py-14 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-6">
          <div className="w-1 h-14 bg-gold flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <p className="font-display text-sm text-gold tracking-widest mb-3">
              YOUR CURRICULUM. YOUR STANDARDS.
            </p>
            <p className="font-sans text-navy text-[15px] leading-relaxed max-w-2xl">
              Randi delivers your training content, your questions, and your pass criteria — not
              generic material. You define what a certified tech looks like for your equipment.
              Randi makes sure the field actually gets there, and stays there. White-labeled to
              your brand, tracked against your records.
            </p>
          </div>
        </div>
      </section>

      <CTABlock
        headline="READY TO ACTUALLY CERTIFY YOUR FIELD TECHS?"
        subhead="Your curriculum. Your standards. Delivered over text, tracked automatically."
        buttonLabel="Set Up a Demo"
        buttonHref="mailto:hello@hey-randi.com"
      />
    </main>
  )
}
