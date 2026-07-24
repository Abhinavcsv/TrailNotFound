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
} from 'lucide-react'
import { Reveal } from './reveal'

const interests = [
  { label: 'Mountains', icon: Mountain },
  { label: 'Road Trips', icon: Car },
  { label: 'Camping', icon: Tent },
  { label: 'Waterfalls', icon: Waves },
  { label: 'Beaches', icon: Palmtree },
  { label: 'Photography', icon: Camera },
  { label: 'Food', icon: UtensilsCrossed },
  { label: 'Treks', icon: Footprints },
  { label: 'Bike Trips', icon: Bike },
  { label: 'Weekend Getaways', icon: CalendarClock },
]

export function ExploreInterests() {
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Explore by interest
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            Travel the way that moves you
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {interests.map((it, i) => (
            <motion.button
              key={it.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center gap-4 rounded-3xl border border-border/70 bg-card px-4 py-8 text-center shadow-sm transition-shadow hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <it.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-foreground">{it.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
