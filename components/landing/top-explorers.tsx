
'use client'

import { motion } from 'framer-motion'
import { Gem, ArrowRight, Compass } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from './reveal'

const explorers = [
  {
    name: 'Ananya Rawat',
    level: 'Trailblazer',
    trips: 128,
    gems: 37,
    avatar: '/images/avatar-1.png',
  },
  {
    name: 'Kabir Sethi',
    level: 'Pathfinder',
    trips: 96,
    gems: 29,
    avatar: '/images/avatar-2.png',
  },
  {
    name: 'Meera Joshi',
    level: 'Summit Guide',
    trips: 154,
    gems: 52,
    avatar: '/images/avatar-3.png',
  },
  {
    name: 'Rohan Thapa',
    level: 'Wayfarer',
    trips: 74,
    gems: 21,
    avatar: '/images/avatar-4.png',
  },
]

export function TopExplorers() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">

        <Reveal className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Meet the explorers
            </p>

            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
              Every trail has a story. Every explorer has one to tell.
            </h2>

            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
              Discover the people behind unforgettable journeys,
              hidden places and inspiring travel experiences.
            </p>
          </div>

          <Link
            href="/community"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/75"
          >
            Explore community
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {explorers.map((explorer, index) => (
            <motion.article
              key={explorer.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col items-center rounded-3xl border border-border/70 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={explorer.avatar}
                  alt={`${explorer.name} profile`}
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-secondary transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gem px-3 py-1 text-[11px] font-semibold text-gem-foreground shadow">
                  {explorer.level}
                </span>
              </div>

              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                {explorer.name}
              </h3>

              <div className="mt-5 grid w-full grid-cols-2 gap-2 rounded-2xl bg-secondary/60 p-3">
                <div>
                  <p className="font-display text-lg font-bold text-foreground">
                    {explorer.trips}
                  </p>
                  <p className="text-xs text-muted-foreground">Trips</p>
                </div>

                <div className="border-l border-border">
                  <p className="inline-flex items-center gap-1 font-display text-lg font-bold text-gem">
                    <Gem className="h-4 w-4" />
                    {explorer.gems}
                  </p>
                  <p className="text-xs text-muted-foreground">Gems discovered</p>
                </div>
              </div>

              <Link
                href="/community"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Compass className="h-4 w-4" />
                Explore profile
              </Link>
            </motion.article>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Sample explorer profiles shown for demonstration.
        </p>
      </div>
    </section>
  )
}
