'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, Wallet, CalendarDays, Compass, Search, Sparkles, ChevronDown } from 'lucide-react'

const searchFields = [
  { icon: MapPin, label: 'Destination', value: 'Anywhere in India' },
  { icon: Wallet, label: 'Budget', value: '₹15,000' },
  { icon: CalendarDays, label: 'Duration', value: '5 days' },
  { icon: Compass, label: 'Travel Style', value: 'Adventure' },
]

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[680px] w-full overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src="/images/hero-himalaya.png"
          alt="A lone traveler on a Himalayan ridge at golden sunrise"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-5 pb-56 text-center sm:pb-40 md:pb-28"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          India&apos;s AI-powered travel community
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Where will your next story begin?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
        >
          Discover India&apos;s hidden places through real explorers and AI-powered
          travel planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:-translate-y-0.5 sm:w-auto">
            Start Exploring
          </button>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto">
            <Sparkles className="h-4 w-4" />
            Try AI Planner
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 text-xs font-medium uppercase tracking-widest text-white/60"
        >
          Trusted by thousands of explorers
        </motion.p>
      </motion.div>

      {/* Floating glass search panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-4 bottom-24 z-20 mx-auto max-w-4xl md:bottom-16"
      >
        <div className="rounded-3xl border border-white/20 bg-white/15 p-2 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-[repeat(4,1fr)_auto]">
            {searchFields.map((f) => (
              <button
                key={f.label}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-white/20"
              >
                <f.icon className="h-5 w-5 shrink-0 text-white/80" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-white/60">
                    {f.label}
                  </span>
                  <span className="block truncate text-sm font-semibold text-white">
                    {f.value}
                  </span>
                </span>
              </button>
            ))}
            <button className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 md:col-span-1 md:mt-0">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1 text-white/70"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
