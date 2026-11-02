
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  MapPin,
  Wallet,
  Coffee,
  Sunrise,
  Backpack,
  Users,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'
import { Reveal } from './reveal'

const aiPoints = [
  { icon: MapPin, text: 'A day-by-day itinerary across Kasol, Tosh & Jibhi' },
  { icon: Wallet, text: 'A budget breakdown designed around ₹18,000' },
  { icon: Coffee, text: 'Cafés and local experiences to explore' },
  { icon: Sunrise, text: 'Scenic viewpoints and memorable moments' },
  { icon: Backpack, text: 'A practical packing checklist for your trip' },
  { icon: Users, text: 'Suggestions tailored to your travel preferences' },
]

export function AiPlanner() {
  return (
    <section className="relative overflow-hidden bg-foreground py-20 text-white md:py-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-gem/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-2 lg:gap-20">

        {/* Left content */}
        <Reveal>
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <Sparkles className="h-4 w-4" />
            Your personal AI travel planner
          </p>

          <h2 className="max-w-xl font-display text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Less time planning.
            <span className="mt-1 block text-white/60">
              More time exploring.
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Tell us where you want to go, what you love, and how much
            you want to spend. Get a personalized itinerary designed
            around your journey.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              'Personalized itineraries',
              'Budget breakdowns',
              'Day-wise activities',
              'Flexible trip planning',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                {feature}
              </div>
            ))}
          </div>

          <Link
            href="/planner"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-foreground shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Build my itinerary
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>

          <p className="mt-4 text-xs text-white/45">
            Your next adventure starts with an idea.
          </p>
        </Reveal>

        {/* Right preview */}
        <Reveal delay={0.15}>
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl sm:p-6">

            {/* Preview header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/20 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">TrailNotFound AI</p>
                  <p className="text-xs text-white/45">Your trip preview</p>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">
                Example
              </span>
            </div>

            {/* User prompt */}
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground shadow-lg">
                Plan a 5-day Himachal trip under ₹18,000.
              </div>
            </div>

            {/* AI response */}
            <div className="mt-5 flex gap-3">
              <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-gem text-white">
                <Sparkles className="h-4 w-4" />
              </span>

              <div className="w-full rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.07] p-4 sm:p-5">
                <p className="mb-4 text-sm font-semibold text-white">
                  Your journey, thoughtfully planned.
                </p>

                <ul className="flex flex-col gap-3">
                  {aiPoints.map((point, index) => {
                    const Icon = point.icon

                    return (
                      <motion.li
                        key={point.text}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.4,
                        }}
                        className="flex items-start gap-3 text-sm leading-relaxed text-white/75"
                      >
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        {point.text}
                      </motion.li>
                    )
                  })}
                </ul>

                {/* Budget preview */}
                <div className="mt-6 rounded-2xl border border-success/20 bg-success/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white/60">
                      Illustrative trip estimate
                    </span>
                    <Wallet className="h-4 w-4 text-success" />
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <span className="font-display text-2xl font-bold text-success sm:text-3xl">
                      ₹16,400
                    </span>
                    <span className="text-xs text-white/50">
                      Example budget: ₹18,000
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}
