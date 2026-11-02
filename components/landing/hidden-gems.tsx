
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Gem,
  Users,
  Clock,
  ArrowUpRight,
  MapPin,
} from 'lucide-react'
import { Reveal } from './reveal'

const gems = [
  {
    title: 'Hidden waterfall near Manali',
    location: 'Kullu, Himachal Pradesh',
    note: 'Community discovered',
    time: 'Best May – October',
    img: '/images/gem-waterfall.png',
    category: 'Nature Escape',
  },
  {
    title: 'A secret alpine lake few have seen',
    location: 'Off the Spiti circuit',
    note: 'Offbeat experience',
    time: 'Best June – September',
    img: '/images/gem-lake.png',
    category: 'Mountain Discovery',
  },
]

export function HiddenGems() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gem">
            <Gem className="h-4 w-4" />
            Beyond the ordinary
          </p>

          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            The places worth discovering
          </h2>

          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Discover lesser-known destinations, local experiences,
            and beautiful corners waiting to become part of your next journey.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {gems.map((gem, index) => (
            <motion.article
              key={gem.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative isolate overflow-hidden rounded-3xl bg-black ${
                index === 0
                  ? 'aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9]'
                  : 'aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/8]'
              }`}
            >
              {/* Background image */}
              <img
                src={gem.img}
                alt={gem.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-9 md:justify-center md:p-14">

                {/* Category */}
                <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                  <Gem className="h-3.5 w-3.5 text-gem" />
                  {gem.category}
                </span>

                {/* Title */}
                <h3 className="max-w-xl font-display text-balance text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                  {gem.title}
                </h3>

                {/* Location */}
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white/75">
                  <MapPin className="h-4 w-4" />
                  {gem.location}
                </p>

                {/* Details */}
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/75 sm:text-sm">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {gem.note}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {gem.time}
                  </span>
                </div>

                {/* CTA */}
                <Link
                  href="/hidden-gems"
                  className="group/button mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Discover this place
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Explore more */}
        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/hidden-gems"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Explore all hidden gems
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

      </div>
    </section>
  )
}
