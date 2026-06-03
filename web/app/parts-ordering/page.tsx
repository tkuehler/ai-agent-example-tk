import type { Metadata } from 'next'
import Link from 'next/link'
import SmsDemo, { type SmsStep } from '@/components/SmsDemo'
import CTABlock from '@/components/CTABlock'

export const metadata: Metadata = {
  title: 'Parts Ordering',
  description:
    'Randi closes the loop from quote to confirmed part order — in the same text thread. Capture the parts sale before the customer shops elsewhere.',
}

const PARTS_SCRIPT: SmsStep[] = [
  {
    from: 'user',
    text: 'Hey my 3025E is throwing a hydraulic fault and won\'t lift',
    pauseAfter: 350,
  },
  {
    from: 'randi',
    text: 'Got it. On a JD 3025E, fault 523726 usually means a clogged hydraulic filter or low fluid. Quick one — do you know when the last filter change was?',
    typingDuration: 1900,
    chips: ['~250 hrs ago', 'Not sure', 'Recently serviced'],
    pauseAfter: 800,
  },
  {
    from: 'user',
    text: 'Been about 280 hours',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'That\'s it. You\'re past the 250-hr service interval.\n\nJD Hydraulic Filter Kit — Part #AT366557\nYour price: $47.80\nIn stock, ships tomorrow\n\nReply ORDER to confirm, or CALL for a tech.',
    typingDuration: 2100,
    chips: ['ORDER', 'CALL'],
    pauseAfter: 800,
  },
  {
    from: 'user',
    text: 'ORDER',
    pauseAfter: 350,
  },
  {
    from: 'randi',
    text: 'Done. Order #PO-28847 placed. Ships to your address on file — tracking number by end of day.\n\nWant a reminder at 500 hours for the next one? Reply YES.',
    typingDuration: 1700,
    chips: ['YES', 'No thanks'],
    pauseAfter: 700,
  },
  {
    from: 'user',
    text: 'YES',
    pauseAfter: 300,
  },
  {
    from: 'randi',
    text: 'Set. I\'ll text you at 500 hours with the kit ready to order. Anything else?',
    typingDuration: 1200,
  },
]

const PROBLEMS = [
  {
    n: '01',
    title: 'The quote that never converts',
    body: 'Tech gets the part number, tells the customer, writes it on a sticky note. Three days later: nothing. The customer either forgot or found it cheaper at the parts counter down the road.',
  },
  {
    n: '02',
    title: 'The competitor sale you didn\'t see coming',
    body: 'You quoted the right part at the right price. But you made them call or email back to confirm. They didn\'t. Amazon did.',
  },
  {
    n: '03',
    title: 'The reorder nobody triggers',
    body: 'Consumables run out on a schedule. Filters, belts, fluids — every unit tells you when it needs them. Nobody asks. The sale just doesn\'t happen.',
  },
]

const STEPS = [
  {
    n: 1,
    title: 'Customer texts the symptom',
    body: 'No portal login. No app. They text the same way they text anyone else.',
  },
  {
    n: 2,
    title: 'Randi pulls the part from your catalog',
    body: 'Matches symptom to part number against your OEM catalog and dealer pricing — not a generic database.',
  },
  {
    n: 3,
    title: 'Quote lands in the same thread',
    body: 'Part number, your price, and one-tap confirm. The friction is gone.',
  },
  {
    n: 4,
    title: 'Customer replies to confirm',
    body: '"ORDER" — that\'s it. Order placed against your system. No portal, no call, no dropped thread.',
  },
  {
    n: 5,
    title: 'Randi schedules the next one',
    body: 'Hour-meter or interval triggers re-prompt the customer when consumables are due. They don\'t have to remember.',
  },
]

const IMPACTS = [
  {
    stat: '3–5×',
    label: 'Higher quote-to-order conversion',
    note: 'When "confirm" is one text, not a callback',
  },
  {
    stat: '$0',
    label: 'Labor cost per confirmed order',
    note: 'No staff time. No portal license. No callbacks.',
  },
  {
    stat: '100%',
    label: 'Capture rate on recurring consumables',
    note: 'When the reminder goes out automatically',
  },
]

export default function PartsOrderingPage() {
  return (
    <main className="pt-16">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-navy pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-6">PARTS ORDERING</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream leading-none mb-8">
            EVERY QUOTE THAT DOESN&apos;T CLOSE IS A PART SOLD SOMEWHERE ELSE.
          </h1>
          <p className="font-editorial italic text-cream/65 text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
            Randi captures the sale in the same text thread. Quote to confirmed order, in one
            conversation — before the customer shops elsewhere.
          </p>
          <Link
            href="#contact"
            className="inline-block bg-gold text-navy font-sans font-bold text-base px-8 py-4 hover:bg-amber-400 transition-colors"
          >
            Set Up a Demo
          </Link>
        </div>
      </section>

      {/* ── The Leak ─────────────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">01 / THE PROBLEM</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            YOU&apos;RE LEAVING PARTS REVENUE ON THE TABLE. EVERY DAY.
          </h2>
          <p className="font-editorial italic text-navy/55 text-xl mb-14">
            It&apos;s not a pricing problem. It&apos;s a friction problem.
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
            FROM SYMPTOM TO SHIPPED PART, IN ONE TEXT THREAD.
          </h2>
          <ol className="space-y-0" aria-label="How parts ordering works">
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
            A REAL PARTS ORDER. NO APP. NO CALL.
          </h2>
          <p className="font-editorial italic text-cream/45 text-lg mb-14 text-center">
            Watch the thread run, or tap Replay to run it again.
          </p>
          <SmsDemo script={PARTS_SCRIPT} />
        </div>
      </section>

      {/* ── Business Impact ──────────────────────────────────────────── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-display text-sm text-gold tracking-widest mb-4">04 / WHAT IT MEANS</p>
          <h2 className="font-display text-4xl md:text-5xl text-navy mb-4 leading-tight">
            PARTS REVENUE THAT USED TO WALK OUT THE DOOR.
          </h2>
          <p className="font-sans text-navy/40 text-sm mb-14">
            Illustrative figures based on typical dealer economics — not a guarantee. Your numbers
            will vary.
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

      {/* ── White-Label Note ─────────────────────────────────────────── */}
      <section className="bg-cream border-t border-navy/10 py-14 px-6">
        <div className="max-w-4xl mx-auto flex items-start gap-6">
          <div className="w-1 h-14 bg-gold flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <p className="font-display text-sm text-gold tracking-widest mb-3">
              YOUR BRAND. YOUR RULES.
            </p>
            <p className="font-sans text-navy text-[15px] leading-relaxed max-w-2xl">
              Randi runs on your catalog, your pricing, and your part numbers. Customers interact
              with your brand — not ours. We&apos;re the engine under the hood. You get the credit,
              the revenue, and the relationship. Randi just never sleeps.
            </p>
          </div>
        </div>
      </section>

      <CTABlock
        headline="READY TO STOP LOSING PARTS REVENUE?"
        subhead="Your catalog. Your pricing. Your brand. Randi closes the sale before the customer shops elsewhere."
        buttonLabel="Set Up a Demo"
        buttonHref="mailto:hello@hey-randi.com"
      />
    </main>
  )
}
