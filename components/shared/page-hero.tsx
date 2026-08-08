'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle?: string
  image?: string
  heightClassName?: string
  children?: ReactNode
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image = '/images/hero-himalaya.png',
  heightClassName = 'h-[56svh] min-h-[420px]',
  children,
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <section ref={ref} className={`relative w-full overflow-hidden ${heightClassName}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>

      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      {/* Fades the image into the page background so the transition below feels seamless */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background md:h-40" />

      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-white/80"
          >
            {subtitle}
          </motion.p>
        )}

        {children}
      </div>
    </section>
  )
}
