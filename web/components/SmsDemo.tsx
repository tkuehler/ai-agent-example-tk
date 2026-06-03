'use client'

import { useState, useEffect, useRef } from 'react'

export interface SmsStep {
  from: 'randi' | 'user'
  text: string
  isPhoto?: boolean
  chips?: string[]
  typingDuration?: number
  pauseAfter?: number
}

interface SmsDemoProps {
  script: SmsStep[]
}

export default function SmsDemo({ script }: SmsDemoProps) {
  const [shown, setShown] = useState<SmsStep[]>([])
  const [typing, setTyping] = useState(false)
  const [done, setDone] = useState(false)

  const tIds = useRef<ReturnType<typeof setTimeout>[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const hasStarted = useRef(false)

  // Always up-to-date reference to avoid stale closures in recursive callbacks
  const advanceRef = useRef<(idx: number) => void>(() => {})
  advanceRef.current = (idx: number) => {
    if (idx >= script.length) {
      setDone(true)
      return
    }
    const step = script[idx]
    const after = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms)
      tIds.current.push(id)
    }
    if (step.from === 'randi') {
      setTyping(true)
      after(() => {
        setTyping(false)
        setShown((prev) => [...prev, step])
        after(() => advanceRef.current(idx + 1), step.pauseAfter ?? 900)
      }, step.typingDuration ?? 1600)
    } else {
      after(() => {
        setShown((prev) => [...prev, step])
        after(() => advanceRef.current(idx + 1), step.pauseAfter ?? 550)
      }, 350)
    }
  }

  const start = () => {
    tIds.current.forEach(clearTimeout)
    tIds.current = []
    setShown([])
    setTyping(false)
    setDone(false)
    const id = setTimeout(() => advanceRef.current(0), 600)
    tIds.current.push(id)
  }

  // Auto-play when scrolled into view
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          start()
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll thread to bottom as messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [shown, typing])

  // Cleanup on unmount
  useEffect(() => () => { tIds.current.forEach(clearTimeout) }, [])

  return (
    <div ref={wrapRef} className="flex flex-col items-center">
      {/* Phone frame */}
      <div className="w-full max-w-[340px] mx-auto select-none" role="img" aria-label="SMS demo thread">
        <div className="bg-[#1a1a1a] rounded-[2.5rem] border-[6px] border-[#2a2a2a] shadow-2xl overflow-hidden">

          {/* Status bar */}
          <div className="bg-[#1a1a1a] px-7 pt-3 pb-1 flex justify-between items-center text-white/80 text-[11px]">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5 opacity-70">
              <svg viewBox="0 0 15 11" className="w-4 h-3 fill-current">
                <rect x="0" y="3" width="3" height="8" rx="0.5" />
                <rect x="4.5" y="2" width="3" height="9" rx="0.5" />
                <rect x="9" y="0" width="3" height="11" rx="0.5" />
                <rect x="13.5" y="0" width="1.5" height="11" rx="0.5" opacity="0.3" />
              </svg>
              <svg viewBox="0 0 25 12" className="w-5 h-3 fill-none stroke-current" strokeWidth="1.5">
                <rect x="1" y="1" width="20" height="10" rx="2" />
                <rect x="2.5" y="2.5" width="13" height="7" rx="1" className="fill-current stroke-none" />
                <path d="M22.5 4v4a2 2 0 0 0 0-4z" className="fill-current stroke-none" />
              </svg>
            </div>
          </div>

          {/* Chat header */}
          <div className="bg-[#1c1c1e] px-4 py-3 flex items-center gap-3 border-b border-white/[0.07]">
            <div
              className="w-9 h-9 rounded-full bg-gold flex items-center justify-center flex-shrink-0"
              aria-hidden="true"
            >
              <span className="font-display text-navy text-sm leading-none">R</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Randi</p>
              <p className="text-emerald-400 text-[11px] leading-tight">Active now</p>
            </div>
          </div>

          {/* Message thread */}
          <div
            className="bg-black min-h-[380px] max-h-[380px] overflow-y-auto px-3 py-3 space-y-2.5 scrollbar-hide"
            aria-live="polite"
            aria-label="Message thread"
          >
            {shown.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-1.5 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.from === 'randi' && (
                  <div
                    className="w-6 h-6 rounded-full bg-gold flex-shrink-0 flex items-center justify-center mb-0.5"
                    aria-hidden="true"
                  >
                    <span className="font-display text-navy text-[10px] leading-none">R</span>
                  </div>
                )}
                <div className="max-w-[80%]">
                  {msg.isPhoto ? (
                    <div
                      className={`rounded-2xl px-3 py-2.5 flex items-center gap-2 ${
                        msg.from === 'user'
                          ? 'rounded-br-sm bg-gold'
                          : 'rounded-bl-sm bg-[#3a3a3c]'
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        stroke={msg.from === 'user' ? '#0f1c2e' : 'rgba(255,255,255,0.8)'}
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span
                        className={`text-[12px] ${
                          msg.from === 'user' ? 'text-navy' : 'text-white/80'
                        }`}
                      >
                        Photo attached
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl px-3 py-2 ${
                        msg.from === 'user'
                          ? 'rounded-br-sm bg-gold text-navy'
                          : 'rounded-bl-sm bg-[#3a3a3c] text-white'
                      }`}
                    >
                      <p className="text-[12px] leading-[1.55] whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  )}

                  {msg.chips && msg.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5" role="group" aria-label="Quick replies">
                      {msg.chips.map((chip) => (
                        <span
                          key={chip}
                          className="border border-gold/40 text-gold/75 text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end gap-1.5" aria-label="Randi is typing">
                <div className="w-6 h-6 rounded-full bg-gold flex-shrink-0 flex items-center justify-center" aria-hidden="true">
                  <span className="font-display text-navy text-[10px] leading-none">R</span>
                </div>
                <div className="bg-[#3a3a3c] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block"
                      style={{
                        animation: 'dotBounce 1.3s ease-in-out infinite',
                        animationDelay: `${i * 0.22}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} aria-hidden="true" />
          </div>

          {/* Input bar */}
          <div className="bg-[#1c1c1e] px-3 py-2.5 flex items-center gap-2 border-t border-white/[0.07]">
            <div className="flex-1 bg-[#2c2c2e] rounded-full px-4 py-1.5 text-white/20 text-[12px]">
              iMessage
            </div>
            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="#e6a01e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="w-20 h-1 rounded-full bg-white/20 mx-auto mt-2" aria-hidden="true" />
      </div>

      {/* Replay */}
      {done && (
        <button
          onClick={start}
          className="mt-8 flex items-center gap-2 border border-gold/40 text-gold text-sm px-6 py-2.5 hover:bg-gold/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
          </svg>
          Replay demo
        </button>
      )}
    </div>
  )
}
