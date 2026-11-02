
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Compass } from 'lucide-react'

export function Cta() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section className="px-5 py-20 md:px-8 md:py-28">
      <div
        ref={ref}
        className="relative mx-auto flex min-h-[440px] max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] md:min-h-[520px]"
      >
        <motion.img
          style={{ y }}
          src="/images/cta-roadtrip.png"
          alt="A winding mountain road through the Himalayas"
          loading="lazy"
          className="absolute inset-0 h-[120%] w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/25" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            The journey begins with you
          </p>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
            Your next journey starts here.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/80 md:text-lg">
            Discover extraordinary places, plan journeys your way
            and find inspiration for the road ahead.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/explore"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground shadow-xl transition-all hover:-translate-y-1 hover:bg-white/90 sm:w-auto"
            >
              <Compass className="h-4 w-4" />
              Explore Destinations
            </Link>

            <Link
              href="/planner"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-1 hover:bg-white/20 sm:w-auto"
            >
              Plan Your Trip
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
