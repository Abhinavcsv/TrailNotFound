'use client'

import { motion } from 'framer-motion'
import { Sparkles, MapPin, Wallet, Coffee, Sunrise, Backpack, Users, ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'

const aiPoints = [
  { icon: MapPin, text: 'A day-by-day itinerary across Kasol, Tosh & Jibhi' },
  { icon: Wallet, text: 'Full budget breakdown that stays under ₹18,000' },
  { icon: Coffee, text: 'Hidden cafés loved by the local community' },
  { icon: Sunrise, text: 'The best sunrise point most travelers miss' },
  { icon: Backpack, text: 'A smart packing list for the season' },
  { icon: Users, text: 'Recommendations from explorers who went recently' },
]

export function AiPlanner() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 text-white md:py-28">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gem/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent">
            <Sparkles className="h-4 w-4" />
            AI Planner
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Plan a meaningful journey in seconds
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/70">
            Tell our AI what you dream of and your budget. It builds a real itinerary
            grounded in what the community actually loves — not generic tourist traps.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5">
            <Sparkles className="h-4 w-4 text-primary" />
            Open AI Planner
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
            {/* user bubble */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg">
                Plan a 5-day Himachal trip under ₹18,000.
              </div>
            </div>

            {/* ai bubble */}
            <div className="mt-4 flex gap-3">
              <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gem text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="w-full max-w-[92%] rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
                <p className="mb-3 text-sm font-semibold text-white">
                  Here&apos;s a trip built just for you ✨
                </p>
                <ul className="flex flex-col gap-2.5">
                  {aiPoints.map((p, i) => (
                    <motion.li
                      key={p.text}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                      className="flex items-start gap-3 text-sm text-white/80"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">
                        <p.icon className="h-3.5 w-3.5" />
                      </span>
                      {p.text}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-success/15 px-4 py-3">
                  <span className="text-sm font-medium text-white/80">Estimated total</span>
                  <span className="font-display text-lg font-bold text-success">₹16,400</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
