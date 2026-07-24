'use client'

import { motion } from 'framer-motion'
import { Gem, Users, Clock, ArrowUpRight } from 'lucide-react'
import { Reveal } from './reveal'

const gems = [
  {
    title: 'Hidden waterfall near Manali',
    location: 'Kullu, Himachal Pradesh',
    note: 'Community discovered · Rarely crowded',
    time: 'Best May – October',
    img: '/images/gem-waterfall.png',
  },
  {
    title: 'A secret alpine lake few have seen',
    location: 'Off the Spiti circuit',
    note: 'Community discovered · Untouched',
    time: 'Best June – September',
    img: '/images/gem-lake.png',
  },
]

export function HiddenGems() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gem">
            <Gem className="h-4 w-4" />
            Hidden Gems
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            Places you won&apos;t find on the usual map
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Quiet corners of India surfaced by explorers who got there first — before
            the crowds ever did.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {gems.map((g, i) => (
            <motion.article
              key={g.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-3xl ${
                i === 0 ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/11] md:aspect-[21/8]'
              }`}
            >
              <img
                src={g.img || '/placeholder.svg'}
                alt={g.title}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:justify-center md:p-14">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gem/90 px-3 py-1 text-xs font-semibold text-gem-foreground backdrop-blur">
                  <Gem className="h-3.5 w-3.5" />
                  Hidden Gem
                </span>
                <h3 className="max-w-xl font-display text-2xl font-bold text-white text-balance sm:text-3xl md:text-4xl">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/80">{g.location}</p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/75">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {g.note}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {g.time}
                  </span>
                </div>
                <button className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5">
                  Discover this place
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
