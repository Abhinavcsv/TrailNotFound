
'use client'

import { motion } from 'framer-motion'
import {
  Mountain,
  Car,
  Tent,
  Waves,
  Palmtree,
  Camera,
  UtensilsCrossed,
  Footprints,
  Bike,
  CalendarClock,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { Reveal } from './reveal'

const interests = [
  { label: 'Mountains', description: 'Find your mountain escape', icon: Mountain },
  { label: 'Road Trips', description: 'Take the scenic route', icon: Car },
  { label: 'Camping', description: 'Sleep under the stars', icon: Tent },
  { label: 'Waterfalls', description: 'Discover nature’s beauty', icon: Waves },
  { label: 'Beaches', description: 'Follow the coastline', icon: Palmtree },
  { label: 'Photography', description: 'Capture unforgettable views', icon: Camera },
  { label: 'Food', description: 'Explore local flavours', icon: UtensilsCrossed },
  { label: 'Treks', description: 'Find your next trail', icon: Footprints },
  { label: 'Bike Trips', description: 'Ride beyond the ordinary', icon: Bike },
  { label: 'Weekend Getaways', description: 'Make weekends count', icon: CalendarClock },
]

export function ExploreInterests() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Find your kind of adventure
          </p>

          <h2 className="font-display text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Travel the way that moves you
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Every traveller has a different story. Discover experiences
            that match the way you love to explore.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {interests.map((interest, index) => {
            const Icon = interest.icon

            return (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  href={`/explore?interest=${encodeURIComponent(interest.label)}`}
                  className="group relative flex h-full min-h-[180px] flex-col items-start justify-between overflow-hidden rounded-3xl border border-border/70 bg-card p-5 text-left shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-h-[195px] sm:p-6"
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground sm:h-14 sm:w-14">
                      <Icon className="h-6 w-6" />
                    </span>

                    <ArrowUpRight className="h-5 w-5 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>

                  <div className="mt-7">
                    <h3 className="text-sm font-bold text-foreground sm:text-base">
                      {interest.label}
                    </h3>

                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {interest.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
