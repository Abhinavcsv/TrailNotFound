
'use client'

import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Gem,
  MapPin,
} from 'lucide-react'

const highlights = [
  {
    icon: Users,
    title: 'Travel Community',
    description:
      'Connect with explorers and discover journeys shared by travellers.',
  },
  {
    icon: BookOpen,
    title: 'Real Travel Stories',
    description:
      'Explore experiences, travel tips and memories from the road.',
  },
  {
    icon: Gem,
    title: 'Hidden Discoveries',
    description:
      'Find lesser-known places and experiences worth exploring.',
  },
  {
    icon: MapPin,
    title: 'Explore Your Way',
    description:
      'Discover destinations and plan journeys across different regions.',
  },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-12 mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            The TrailNotFound experience
          </p>

          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            More than just finding places.
          </h2>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            A space to discover destinations, plan meaningful journeys
            and share the experiences that make travel special.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="rounded-3xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="font-display text-lg font-bold text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
