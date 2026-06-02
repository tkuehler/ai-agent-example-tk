import Link from 'next/link'

interface CTABlockProps {
  headline?: string
  subhead?: string
  buttonLabel?: string
  buttonHref?: string
}

export default function CTABlock({
  headline = 'READY TO STOP LOSING PARTS REVENUE?',
  subhead = 'Your catalog. Your pricing. Your brand. Randi just never sleeps.',
  buttonLabel = 'Set Up a Demo',
  buttonHref = 'mailto:hello@hey-randi.com',
}: CTABlockProps) {
  return (
    <section id="contact" className="bg-navy py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-display text-sm text-gold tracking-widest mb-6">GET STARTED</p>
        <h2 className="font-display text-5xl md:text-6xl text-cream mb-6 leading-none">{headline}</h2>
        <p className="font-editorial italic text-cream/55 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          {subhead}
        </p>
        <Link
          href={buttonHref}
          className="inline-block bg-gold text-navy font-sans font-bold text-base px-8 py-4 hover:bg-amber-400 transition-colors"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
