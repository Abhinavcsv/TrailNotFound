'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

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
        className="relative mx-auto flex min-h-[420px] max-w-7xl items-center justify-center overflow-hidden rounded-[2rem] md:min-h-[520px]"
      >
        <motion.img
          style={{ y }}
          src="/images/cta-roadtrip.png"
          alt="A winding mountain road trip through the Himalayas at dusk"
          className="absolute inset-0 h-[120%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/30" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-2xl px-6 text-center"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl md:text-6xl">
            Your next adventure is waiting.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/80">
            Join a growing community of explorers discovering the India most people
            never see.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground shadow-xl transition-transform hover:-translate-y-0.5">
            Join the Community
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
