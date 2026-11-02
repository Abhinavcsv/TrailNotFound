
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Reveal } from './reveal'

const destinations = [
  {
    name: 'Tirthan Valley',
    state: 'Himachal Pradesh',
    img: '/images/dest-tirthan.png',
    category: 'Mountain Escape',
  },
  {
    name: 'Ziro Valley',
    state: 'Arunachal Pradesh',
    img: '/images/dest-ziro.png',
    category: 'Nature & Culture',
  },
  {
    name: 'Spiti',
    state: 'Himachal Pradesh',
    img: '/images/dest-spiti.png',
    category: 'Adventure',
  },
  {
    name: 'Chopta',
    state: 'Uttarakhand',
    img: '/images/dest-chopta.png',
    category: 'Mountain Escape',
  },
  {
    name: 'Munsiyari',
    state: 'Uttarakhand',
    img: '/images/dest-munsiyari.png',
    category: 'Offbeat Destination',
  },
]

export function FeaturedDestinations() {
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Explore the extraordinary
            </p>

            <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Places that stay with you
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              From quiet mountain villages to unforgettable landscapes,
              discover places worth travelling for.
            </p>
          </div>

          <Link
            href="/explore"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Explore all destinations
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 no-scrollbar md:px-8">
        {destinations.map((destination, index) => (
          <motion.article
            key={destination.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[24rem]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/50">
              <img
                src={destination.img}
                alt={`${destination.name}, ${destination.state}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

              {/* Category */}
              <div className="absolute left-5 top-5">
                <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-lg">
                  {destination.category}
                </span>
              </div>

              {/* Destination information */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-1.5 text-sm text-white/75">
                      <MapPin className="h-3.5 w-3.5" />
                      {destination.state}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
                      {destination.name}
                    </h3>
                  </div>

                  <Link
                    href="/explore"
                    aria-label={`Explore ${destination.name}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:rotate-45 hover:bg-white hover:text-black"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Mobile scroll hint */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground md:hidden">
        Swipe to discover more
        <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </section>
  )
}
